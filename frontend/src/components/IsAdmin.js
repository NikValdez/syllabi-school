import React from 'react'
import { Query } from 'react-apollo'
import { CURRENT_USER_QUERY } from './User'

const IsAdminTeacher = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, error, loading }) => {
      if (loading) return null
      if (error) return <p>Error : {error.message}</p>
      if (
        data.me.permissions.some(permission => ['ADMIN'].includes(permission))
      ) {
        return props.children
      } else {
        return null
      }
    }}
  </Query>
)

export default IsAdminTeacher
