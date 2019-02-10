import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { ALL_COURSES_QUERY } from './Courses'
import { Quill } from './CreateEvent'
import Error from './ErrorMessage'
import IsAdminTeacher from './IsAdminTeacher'
import Form from './styles/Form'
import { CURRENT_USER_QUERY } from './User'

const CREATE_COURSE_MUTATION = gql`
  mutation CREATE_COURSE_MUTATION(
    $title: String!
    $description: String!
    $credits: Int!
    $courseCode: String!
    $image: String
    $color: String
    $institution: ID!
  ) {
    createCourse(
      title: $title
      description: $description
      credits: $credits
      courseCode: $courseCode
      image: $image
      color: $color
      institution: $institution
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
    image: '',
    color: '',
    institution: ''
  }

  getRandomColor = () => {
    let hue = Math.floor(Math.random() * 360)
    let pastel = 'hsl(' + hue + ', 100%, 87.5%)'
    return pastel
  }
  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val, color: this.getRandomColor() })
  }

  onDescriptionChange = value => {
    this.setState({
      description: value
    })
  }
  render() {
    return (
      <IsAdminTeacher>
        <Query query={CURRENT_USER_QUERY}>
          {({ data, error, loading }) => {
            if (error) return <p>Error : {error.message}</p>
            return (
              <Mutation
                mutation={CREATE_COURSE_MUTATION}
                variables={this.state}
                refetchQueries={[{ query: ALL_COURSES_QUERY }]}
              >
                {(createCourse, { loading, error }) => (
                  <Form
                    onSubmit={async e => {
                      e.preventDefault()
                      await this.setState({
                        institution: data.me.institution.id
                      })
                      const res = await createCourse()
                      this.props.history.push(
                        `/courses/${res.data.createCourse.id}`
                      )
                    }}
                  >
                    <Error error={error} />
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
                      <label htmlFor="credits">
                        Credits
                        <input
                          type="text"
                          id="credits"
                          name="credits"
                          placeholder="Credits"
                          required
                          value={this.state.credits}
                          onChange={this.handleChange}
                        />
                      </label>
                      <label htmlFor="description">
                        Description
                        <Quill>
                          <ReactQuill
                            placeholder="Add a description..."
                            theme="snow"
                            value={this.state.description}
                            onChange={this.onDescriptionChange}
                            modules={CreateCourse.modules}
                            formats={CreateCourse.formats}
                          />
                        </Quill>
                      </label>
                      <button
                        type="submit"
                        style={{ marginTop: '3rem', marginBottom: '3rem' }}
                      >
                        Submit
                      </button>
                    </fieldset>
                  </Form>
                )}
              </Mutation>
            )
          }}
        </Query>
      </IsAdminTeacher>
    )
  }
}

CreateCourse.modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' }
    ],
    [{ font: [] }],
    ['link'],
    ['clean']
  ]
}

CreateCourse.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'indent',
  'link',
  'color'
]

export default CreateCourse
export { CREATE_COURSE_MUTATION }
