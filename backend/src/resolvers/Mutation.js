const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { hasPermission } = require('../utils')

const Mutations = {
  async createCourse(parent, args, ctx, info) {
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
  }
}

module.exports = Mutations
