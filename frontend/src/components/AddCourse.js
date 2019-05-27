import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY_COURSES_EVENTS } from './MyCourses'

const ADD_COURSE_MUTATION = gql`
  mutation ADD_COURSE_MUTATION($id: ID!) {
    addCourseToUser(id: $id) {
      id
    }
  }
`

class AddCourse extends Component {
  render() {
    const { id } = this.props

    return (
      <Mutation
        mutation={ADD_COURSE_MUTATION}
        variables={{
          id
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY_COURSES_EVENTS }]}
      >
        {(addCourseToUser, { loading, error }) => {
          if (error) return <Error error={error} />
          return (
            <button disabled={loading} onClick={addCourseToUser}>
              Add{loading && 'ing'}
            </button>
          )
        }}
      </Mutation>
    )
  }
}

export default AddCourse
