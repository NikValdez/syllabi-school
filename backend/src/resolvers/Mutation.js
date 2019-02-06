const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { hasPermission } = require('../utils')
const { transport, makeANiceEmail } = require('../mail')

const Mutations = {
  async createInstitution(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!')
    }
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ['ADMIN'].includes(permission)
    )
    if (!hasPermissions) {
      throw new Error("You don't have permission to do that")
    }
    const institution = await ctx.db.mutation.createInstitution(
      {
        data: {
          ...args
        }
      },
      info
    )
    return institution
  },
  async createCourse(parent, { institution, ...args }, ctx, info) {
    console.log(ctx.request.userId)
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!')
    }
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ['ADIMN', 'TEACHER'].includes(permission)
    )
    if (!hasPermissions) {
      throw new Error("You don't have permission to do that")
    }
    const course = await ctx.db.mutation.createCourse(
      {
        data: {
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          institution: {
            connect: {
              id: institution
            }
          },
          ...args
        }
      },
      info
    )
    return course
  },
  async deleteCourse(parent, args, ctx, info) {
    const where = { id: args.id }
    //find the course
    const course = await ctx.db.query.course({ where }, `{id title user {id}}`)
    //check if they own that course or have permission
    const ownsCourse = course.user.id === ctx.request.userId
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ['ADIMN', 'TEACHER'].includes(permission)
    )
    if (!ownsCourse && !hasPermissions) {
      throw new Error("You don't have permission to do that")
    }
    //Delete it
    return ctx.db.mutation.deleteCourse({ where }, info)
  },

  //update course
  async updateCourse(parent, args, ctx, info) {
    const where = { id: args.id }
    //find the course
    const course = await ctx.db.query.course({ where }, `{id title user {id}}`)
    //check if they own that course or have permission
    const ownsCourse = course.user.id === ctx.request.userId
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ['ADIMN', 'TEACHER'].includes(permission)
    )
    if (!ownsCourse && !hasPermissions) {
      throw new Error("You don't have permission to do that")
    }
    const updates = { ...args }
    //remove update ID
    delete updates.id

    //run update method
    return ctx.db.mutation.updateCourse(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    )
  },

  //create an event
  async createEvent(parent, { course, ...args }, ctx, info) {
    const event = await ctx.db.mutation.createEvent(
      {
        data: {
          //This creates the relationship between the event and course
          course: {
            connect: {
              id: course
            }
          },
          ...args
        }
      },
      info
    )
    return event
  },
  async deleteEvent(parent, args, ctx, info) {
    const where = { id: args.id }
    //find the event
    const event = await ctx.db.query.event({ where }, `{id title}`)
    //check if they own that event or have permission

    //Delete it
    return ctx.db.mutation.deleteEvent({ where }, info)
  },
  async updateEvent(parent, args, ctx, info) {
    const where = { id: args.id }
    //find the event
    //TODO: Add auth making sure they created the event.
    const event = await ctx.db.query.event({ where }, `{id}`)
    //check if they own that course or have permission
    // const ownsCourse = course.user.id === ctx.request.userId
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ['ADIMN', 'TEACHER'].includes(permission)
    )
    if (!hasPermissions) {
      throw new Error("You don't have permission to do that")
    }
    const updates = { ...args }
    //remove update ID
    delete updates.id

    //run update method
    return ctx.db.mutation.updateEvent(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    )
  },

  async signup(parent, { institution, ...args }, ctx, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          institution: {
            connect: { id: institution }
          },
          ...args,
          password,
          permissions: { set: ['USER'] }
        }
      },
      info
    )
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)

    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    })
    return user
  },

  async signin(parent, { email, password }, ctx, info) {
    // 1. check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } })
    if (!user) {
      throw new Error(`No such user found for email ${email}`)
    }
    // 2. Check if their password is correct
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new Error('Invalid Password!')
    }
    // 3. generate the JWT Token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // 4. Set the cookie with the token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    })
    // 5. Return the user
    return user
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token')
    return { message: 'See ya!' }
  },
  async requestReset(parent, args, ctx, info) {
    //1. check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } })
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`)
    }
    //2.set a reset token and expiry on that user
    const randomBytesPromiseified = promisify(randomBytes)
    const resetToken = (await randomBytesPromiseified(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 //1 hour
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    })

    //3.Email them that reset token
    const mailRes = await transport.sendMail({
      from: 'schedule@schedule.com',
      to: user.email,
      subject: 'Your password reset token',
      html: makeANiceEmail(`Your Password Reset Token is Here! 
      \n\n 
      <a href="${
        process.env.FRONTEND_URL
      }/reset/${resetToken}">Click Here to Reset</a>`)
    })
    return { message: 'Thanks' }
  },
  async resetPassword(parent, args, ctx, info) {
    if (args.password !== args.confirmPassword) {
      throw new Error("Your Passwords don't match!")
    }
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    })
    if (!user) {
      throw new Error('This token is invalid or expired!')
    }
    const password = await bcrypt.hash(args.password, 10)

    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    })
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET)
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 265
    })
    return updatedUser
  },
  async updatePermissions(parent, args, ctx, info) {
    //1. Check if logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!')
    }
    //2. Query the current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    )
    //3. check if they have permissions to do this
    hasPermission(currentUser, ['ADIMN', 'PERMISSIONUPDATE'])
    //4. Update the permission
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions
          }
        },
        where: {
          id: args.userId
        }
      },
      info
    )
  },
  async addCourseToUser(parent, args, ctx, info) {
    const { userId } = ctx.request
    if (!userId) {
      throw new Error('You must be signed in')
    }

    const [existingMyCourse] = await ctx.db.query.myCourses({
      where: {
        courses: null,
        user: { id: userId }
      }
    })

    if (!existingMyCourse) {
      return ctx.db.mutation.createMyCourse(
        {
          data: {
            user: {
              connect: { id: userId }
            },
            courses: {
              connect: { id: args.id }
            }
          }
        },
        info
      )
    } else {
      throw new Error('You already added this course!')
    }
  },
  async deleteMyCourse(parent, args, ctx, info) {
    const where = { id: args.id }
    //find the Course
    const myCourse = await ctx.db.query.myCourse({ where }, `{id}`)
    //check if they own that course or have permission

    //Delete it
    return ctx.db.mutation.deleteMyCourse({ where }, info)
  },
  async createNote(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!')
    }

    const note = await ctx.db.mutation.createNote(
      {
        data: {
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    )
    return note
  },
  async deleteNote(parent, args, ctx, info) {
    const where = { id: args.id }
    //find the Course
    const note = await ctx.db.query.note({ where }, `{id}`)
    //check if they own that course or have permission

    //Delete it
    return ctx.db.mutation.deleteNote({ where }, info)
  },
  async createAnnouncement(parent, { course, ...args }, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!')
    }
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ['ADIMN', 'TEACHER'].includes(permission)
    )
    if (!hasPermissions) {
      throw new Error("You don't have permission to do that")
    }

    const announcement = await ctx.db.mutation.createAnnouncement(
      {
        data: {
          user: {
            connect: { id: ctx.request.userId }
          },
          course: {
            connect: {
              id: course
            }
          },
          ...args
        }
      },
      info
    )
    return announcement
  },
  async updateAnnouncement(parent, args, ctx, info) {
    const updates = { ...args }
    //remove update ID
    delete updates.id

    //run update method
    return ctx.db.mutation.updateAnnouncement(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    )
  }
}

module.exports = Mutations
