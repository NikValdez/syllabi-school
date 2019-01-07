import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import { CURRENT_USER_QUERY_COURSES_EVENTS } from './MyCourses'

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
          <span
            style={{ marginTop: '1rem' }}
            onClick={() => {
              if (
                window.confirm('Are you sure you want to delete this Course?')
              ) {
                deleteMyCourse()
              }
            }}
          >
            ✖️
          </span>
        )}
      </Mutation>
    )
  }
}

export default DeleteMyCourse
