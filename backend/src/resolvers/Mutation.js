const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    args.email = args.email.toLowerCase()
    //hash password
    const password = await bcrypt.hash(args.password, 10)
    //create user
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
    //create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    //Set the JWT as cookie on response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 //1 year
    })
    return user
  }
}

module.exports = Mutations
