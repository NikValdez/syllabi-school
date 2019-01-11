import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Form from './styles/Form'
import { ALL_COURSES_QUERY } from './Courses'
import Error from './ErrorMessage'
import IsAdminTeacher from './IsAdminTeacher'
import { Quill } from './CreateEvent'

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

  onDescriptionChange = value => {
    this.setState({
      description: value
    })
  }
  render() {
    return (
      <IsAdminTeacher>
        <Mutation
          mutation={CREATE_COURSE_MUTATION}
          variables={this.state}
          refetchQueries={[{ query: ALL_COURSES_QUERY }]}
        >
          {(createCourse, { loading, error }) => (
            <Form
              onSubmit={async e => {
                e.preventDefault()
                const res = await createCourse()
                this.props.history.push(`/courses/${res.data.createCourse.id}`)
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
                <button type="submit">Submit</button>
              </fieldset>
            </Form>
          )}
        </Mutation>
      </IsAdminTeacher>
    )
  }
}

CreateCourse.modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
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
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'color'
]

export default CreateCourse
export { CREATE_COURSE_MUTATION }
