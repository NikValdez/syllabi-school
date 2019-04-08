import React from 'react'
import { Query } from 'react-apollo'
import Signin from './Signin'
import { CURRENT_USER_QUERY } from './User'

const PleaseSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Cannot find current user</p>
      if (!data.me) {
        return <Signin />
      }
      return props.children
    }}
  </Query>
)

export default PleaseSignIn
