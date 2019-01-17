import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { CURRENT_USER_QUERY_COURSES_EVENTS } from './MyCourses'
import { DeleteXStyles } from './DeleteNote'
import XIcon from './styles/XIcon'

const DELETE_MYCOURSE_MUTATION = gql`
  mutation DELETE_MYCOURSE_MUTATION($id: ID!) {
    deleteMyCourse(id: $id) {
      id
    }
  }
`

export class DeleteMyCourse extends Component {
  render() {
    return (
      <Mutation
        mutation={DELETE_MYCOURSE_MUTATION}
        variables={{ id: this.props.id }}
        refetchQueries={[{ query: CURRENT_USER_QUERY_COURSES_EVENTS }]}
      >
        {(deleteMyCourse, { error }) => (
          <DeleteXStyles
            style={{ marginTop: '1rem' }}
            onClick={() => {
              if (
                window.confirm('Are you sure you want to delete this Course?')
              ) {
                deleteMyCourse()
              }
            }}
          >
            <XIcon />
          </DeleteXStyles>
        )}
      </Mutation>
    )
  }
}
