const { forwardTo } = require('prisma-binding')
const { hasPermission } = require('../utils')
const Query = {
  courses: forwardTo('db'),
  course: forwardTo('db'),
  events: forwardTo('db'),
  me(parent, args, ctx, info) {
    //check if there is a current user ID
    if (!ctx.request.userId) {
      return null
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    )
  }
}

module.exports = Query
