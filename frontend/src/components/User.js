import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { Query } from 'react-apollo'

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      email
      name
      permissions
      institution {
        id
        name
        logo
      }
    }
  }
`

const User = props => (
  <Query {...props} query={CURRENT_USER_QUERY}>
    {payload => props.children(payload)}
  </Query>
)

User.propTypes = {
  children: PropTypes.func.isRequired
}

export default User
export { CURRENT_USER_QUERY }
