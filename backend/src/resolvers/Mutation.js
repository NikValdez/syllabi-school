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
  }
}

module.exports = Mutations
