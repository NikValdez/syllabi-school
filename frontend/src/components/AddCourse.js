import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Error from './ErrorMessage'

const ADD_COURSE_MUTATION = gql`
  mutation addCourseToUser($id: ID!) {
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
      >
        {(addCourseToUser, { loading, error }) => {
          if (error) return <Error error={error} />
          return (
            <button disabled={loading} onClick={addCourseToUser}>
              Add{loading && 'ing'} Course
            </button>
          )
        }}
      </Mutation>
    )
  }
}

export default AddCourse
