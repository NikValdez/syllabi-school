import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { ALL_COURSES_QUERY } from './Courses'

const DELETE_COURSE_MUTATION = gql`
  mutation DELETE_COURSE_MUTATION($id: ID!) {
    deleteCourse(id: $id) {
      id
    }
  }
`

export class DeleteCourse extends Component {
  render() {
    return (
      <Mutation
        mutation={DELETE_COURSE_MUTATION}
        variables={{ id: this.props.id }}
        refetchQueries={[{ query: ALL_COURSES_QUERY }]}
      >
        {(deleteCourse, { error }) => (
          <button
            onClick={() => {
              if (
                window.confirm('Are you sure you want to delete this item?')
              ) {
                deleteCourse()
              }
            }}
          >
            {this.props.children}
          </button>
        )}
      </Mutation>
    )
  }
}

export default DeleteCourse
