import gql from 'graphql-tag'
import React from 'react'
import { Mutation } from 'react-apollo'
import { CURRENT_USER_QUERY } from './User'

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`

const Signout = props => (
  <Mutation
    mutation={SIGN_OUT_MUTATION}
    refetchQueries={[
      {
        query: CURRENT_USER_QUERY
      }
    ]}
  >
    {signout => <span onClick={signout}>Sign Out</span>}
  </Mutation>
)

export default Signout
