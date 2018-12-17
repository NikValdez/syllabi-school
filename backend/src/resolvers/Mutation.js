const Mutations = {
  async createItem(parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    )
    return item
  },

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
  }
}

module.exports = Mutations
