import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const CREATE_COURSE_MUTATION = gql`
  mutation CREATE_COURSE_MUTATION(
    $title: String!
    $description: String!
    $credits: Int!
    $courseCode: String!
    $image: String
  ) {
    createCourse(
      title: $title
      description: $description
      credits: $credits
      courseCode: $courseCode
      image: $image
    ) {
      id
    }
  }
`

class CreateCourse extends Component {
  state = {
    title: '',
    description: '',
    credits: 0,
    courseCode: '',
    image: ''
  }

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val })
  }
  render() {
    return (
      <Mutation mutation={CREATE_COURSE_MUTATION} variables={this.state}>
        {(createCourse, { loading, error }) => (
          <form
            onSubmit={async e => {
              e.preventDefault()
              const res = await createCourse()
              console.log(res)
              this.props.history.push(`/`)
            }}
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
                  value={this.state.title}
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
                  value={this.state.courseCode}
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
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </form>
        )}
      </Mutation>
    )
  }
}

export default CreateCourse
export { CREATE_COURSE_MUTATION }
