import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { ALL_COURSES_QUERY } from './Courses'
import { CURRENT_USER_QUERY_COURSES_EVENTS } from './MyCourses'
import { SEARCH_COURSES_QUERY } from './Search'

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
        refetchQueries={[
          { query: ALL_COURSES_QUERY },
          { query: CURRENT_USER_QUERY_COURSES_EVENTS },
          { query: SEARCH_COURSES_QUERY }
        ]}
      >
        {(deleteCourse, { error }) => (
          <button
            className="button"
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to delete this Department?'
                )
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
          </button>
        )}
      </Mutation>
    )
  }
}

export default withRouter(DeleteCourse)
