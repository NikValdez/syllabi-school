import gql from 'graphql-tag'
import htmlToText from 'html-to-text'
import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import Book from '../book.gif'
import { ALL_COURSES_QUERY } from './Courses'
import Form from './styles/Form'

const EDIT_COURSE_QUERY = gql`
  query EDIT_COURSE_QUERY($id: ID!) {
    course(where: { id: $id }) {
      id
      title
      description
      credits
      courseCode
    }
  }
`
const UPDATE_COURSE_MUTATION = gql`
  mutation UPDATE_COURSE_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $credits: Int
    $courseCode: String
  ) {
    updateCourse(
      id: $id
      title: $title
      description: $description
      credits: $credits
      courseCode: $courseCode
    ) {
      id
      title
      description
      credits
      courseCode
    }
  }
`

class UpdateCourse extends Component {
  state = {}

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val })
  }

  updateCourse = async (e, updateCourseMutation) => {
    e.preventDefault()
    await updateCourseMutation({
      variables: {
        id: this.props.match.params.id,
        ...this.state
      }
    })
    this.props.history.push(`/courses/${this.props.match.params.id}`)
  }
  render() {
    return (
      <Query
        query={EDIT_COURSE_QUERY}
        variables={{
          id: this.props.match.params.id
        }}
      >
        {({ data, loading }) => {
          if (loading) return <img src={Book} alt="Loading" />
          if (!data.course)
            return <p>No Course Found For ID {this.props.match.params.id}</p>
          return (
            <Mutation
              mutation={UPDATE_COURSE_MUTATION}
              variables={this.state}
              refetchQueries={[{ query: ALL_COURSES_QUERY }]}
            >
              {(updateCourse, { loading, error }) => (
                <Form
                  onSubmit={e =>
                    this.updateCourse(e, updateCourse).catch(err => {
                      alert(err.message)
                    })
                  }
                >
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="title"
                        required
                        defaultValue={data.course.title}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="courseCode">
                      Course Code
                      <input
                        type="text"
                        id="courseCode"
                        name="courseCode"
                        placeholder="Course Code"
                        required
                        defaultValue={data.course.courseCode}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="credits">
                      Credits
                      <input
                        type="text"
                        id="credits"
                        name="credits"
                        placeholder="Credits"
                        required
                        defaultValue={data.course.credits}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        type="text"
                        id="description"
                        name="description"
                        placeholder="description"
                        required
                        defaultValue={htmlToText.fromString(
                          data.course.description
                        )}
                        onChange={this.handleChange}
                      />
                    </label>
                    <button type="submit" style={{ margin: '2rem 0 10rem 0' }}>
                      Save Changes
                    </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}

export default UpdateCourse
export { UPDATE_COURSE_MUTATION }
