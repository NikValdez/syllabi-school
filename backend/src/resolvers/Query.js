const { forwardTo } = require('prisma-binding')
const { hasPermission } = require('../utils')
const Query = {
  institutions: forwardTo('db'),
  institution: forwardTo('db'),
  courses: forwardTo('db'),
  course: forwardTo('db'),
  events: forwardTo('db'),
  event: forwardTo('db'),
  myCourses: forwardTo('db'),
  announcements: forwardTo('db'),
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
  },

  async users(parent, args, ctx, info) {
    //1. check if they are logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!')
    }
    //2. check if the user has the permissions to query all the users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])
    //3. If they do, query all the users
    return ctx.db.query.users({}, info)
  }
}

module.exports = Query
