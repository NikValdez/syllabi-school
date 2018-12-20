const { forwardTo } = require('prisma-binding')
const Query = {
  //   async items(parent, args, ctx, info) {
  //     const items = await ctx.db.query.items()
  //     return items
  //   }
  courses: forwardTo('db'),
  course: forwardTo('db'),
  events: forwardTo('db')
}

module.exports = Query
