const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { hasPermission } = require('../utils')
const { transport, makeANiceEmail } = require('../mail')

const Mutations = {
  async createCourse(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!')
    }
    const course = await ctx.db.mutation.createCourse(
      {
        data: {
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
    const course = await ctx.db.query.course({ where }, `{id title}`)
    //check if they own that course or have permission

    //Delete it
    return ctx.db.mutation.deleteCourse({ where }, info)
  },

  //update course

  updateCourse(parent, args, ctx, info) {
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

  async signup(parent, args, ctx, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser(
      {
        data: {
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
  }
}

module.exports = Mutations
