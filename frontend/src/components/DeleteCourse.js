import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { ALL_COURSES_QUERY } from './Courses'
import DeleteButton from './styles/DeleteButton'
import { withRouter } from 'react-router-dom'

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
          <DeleteButton
            onClick={() => {
              if (
                window.confirm('Are you sure you want to delete this Course?')
              ) {
                deleteCourse()
                  .then(() => this.props.history.push('/'))
                  .catch(err => {
                    alert(err.message)
                  })
              }
            }}
          >
            {this.props.children}
          </DeleteButton>
        )}
      </Mutation>
    )
  }
}

export default withRouter(DeleteCourse)
