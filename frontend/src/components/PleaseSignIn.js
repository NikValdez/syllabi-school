import React from 'react'
import { Query } from 'react-apollo'
import Signin from './Signin'
import { CURRENT_USER_QUERY } from './User'

const PleaseSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading, error }) => {
      if (loading)
        return (
          <progress class="progress is-small is-primary" max="100">
            45%
          </progress>
        )

      if (error) return <p className="error-message">Cannot fetch data</p>
      if (!data.me) {
        return <Signin />
      }
      return props.children
    }}
  </Query>
)

export default PleaseSignIn
