import React from 'react'
import { Query } from 'react-apollo'
import Signin from './Signin'
import Container from './styles/Container'
import { CURRENT_USER_QUERY } from './User'

const PleaseSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <p>Loading...</p>
      if (!data.me) {
        return (
          <Container>
            <p>Please Sign In Before Continuing</p>
            <Signin />
          </Container>
        )
      }
      return props.children
    }}
  </Query>
)

export default PleaseSignIn
