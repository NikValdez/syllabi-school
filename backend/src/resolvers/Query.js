const { forwardTo } = require('prisma-binding')
const Query = {
  items: forwardTo('db'),
  //   async items(parent, args, ctx, info) {
  //     const items = await ctx.db.query.items()
  //     return items
  //   }
  courses: forwardTo('db'),
  course: forwardTo('db'),
  events: forwardTo('db')
}

module.exports = Query
