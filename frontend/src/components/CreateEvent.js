import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Form from './styles/Form'
import { SINGLE_COURSE_QUERY } from './SingleCourse'
import styled from 'styled-components'

const DatePick = styled.div`
  padding: 10px;
`
const UploadPreview = styled.div`
  width: 200px;
`

const CREATE_EVENT_MUTATION = gql`
  mutation CREATE_EVENT_MUTATION(
    $title: String!
    $description: String!
    $start: DateTime!
    $end: DateTime!
    $allDay: Boolean
    $upload: String
    $course: ID!
  ) {
    createEvent(
      title: $title
      description: $description
      start: $start
      end: $end
      allDay: $allDay
      upload: $upload
      course: $course
    ) {
      id
    }
  }
`

class CreateEvent extends Component {
  state = {
    title: '',
    description: '',
    start: null,
    end: null,
    allDay: false,
    upload: '',
    course: this.props.course,
    loading: false
  }

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val })
  }
  handleStartDateChange = date => {
    this.setState({
      start: date
    })
  }
  handleEndDateChange = date => {
    this.setState({
      end: date
    })
  }

  uploadFile = async e => {
    const files = e.target.files
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', 'schedule')
    this.setState({ loading: true })
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/nikcochran/image/upload/',
      {
        method: 'POST',
        body: data
      }
    )
    const file = await res.json()
    // console.log(file)
    this.setState({
      upload: file.secure_url,
      loading: false
    })
  }

  render() {
    // console.log(this.props.course)
    return (
      <Mutation
        mutation={CREATE_EVENT_MUTATION}
        variables={this.state}
        refetchQueries={[
          { query: SINGLE_COURSE_QUERY, variables: { id: this.props.course } }
        ]}
      >
        {(createEvent, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault()
              const res = await createEvent()
              console.log(res)
              this.setState({
                title: '',
                description: '',
                start: null,
                end: null,
                allDay: false,
                upload: ''
              })
              // this.props.history.push(`/`)
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
              <label htmlFor="start">
                <DatePick>Event Start</DatePick>
                <DatePicker
                  selected={this.state.start}
                  onChange={this.handleStartDateChange}
                  placeholderText="Click to select start date"
                />
              </label>
              <label htmlFor="end">
                <DatePick>Event End</DatePick>
                <DatePicker
                  selected={this.state.end}
                  onChange={this.handleEndDateChange}
                  placeholderText="Click to select end date"
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
              <label htmlFor="file">
                Upload
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload a file or image"
                  onChange={this.uploadFile}
                />
                {this.state.loading ? <p>Loading...</p> : null}
                {this.state.upload && (
                  <UploadPreview>
                    <img src={this.state.upload} alt="Upload Preview" />
                  </UploadPreview>
                )}
              </label>
              <button type="submit" disabled={this.state.loading}>
                Submit
              </button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default CreateEvent
export { CREATE_EVENT_MUTATION }
