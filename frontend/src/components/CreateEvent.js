import gql from 'graphql-tag'
import moment from 'moment'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ReactHtmlParser from 'react-html-parser'
import ReactModal from 'react-modal'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import FilePlaceholder from '../images/filePlaceholder.png'
import IsAdminTeacher from './IsAdminTeacher'
import { SINGLE_COURSE_QUERY } from './SingleCourse'

const CREATE_EVENT_MUTATION = gql`
  mutation CREATE_EVENT_MUTATION(
    $title: String!
    $description: String!
    $start: DateTime!
    $end: DateTime!
    $allDay: Boolean
    $upload: String
    $color: String
    $course: ID!
    $email: String
  ) {
    createEvent(
      title: $title
      description: $description
      start: $start
      end: $end
      allDay: $allDay
      upload: $upload
      color: $color
      course: $course
      email: $email
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
    color: this.props.course.color,
    course: this.props.course.id,
    loading: false,
    showModal: false,
    email: ''
  }

  handleOpenEvent = () => {
    this.setState({ showModal: true })
  }

  handleCloseModal = () => {
    this.setState({ showModal: false })
  }

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val })
  }
  handleStartDateChange = date => {
    this.setState({
      start: moment(date).toDate()
    })
  }
  handleEndDateChange = date => {
    this.setState({
      end: moment(date).toDate()
    })
  }

  uploadFile = async e => {
    const files = e.target.files
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', 'schedule')
    this.setState({ loading: true })
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/nikcochran/raw/upload/',
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

  onDescriptionChange = value => {
    this.setState({
      description: value
    })
  }

  render() {
    return (
      <IsAdminTeacher>
        <button onClick={this.handleOpenEvent}>Create Event</button>
        <Mutation
          mutation={CREATE_EVENT_MUTATION}
          variables={this.state}
          refetchQueries={[
            {
              query: SINGLE_COURSE_QUERY,
              variables: { id: this.props.course.id }
            }
          ]}
        >
          {(createEvent, { loading, error }) => (
            <ReactModal
              isOpen={this.state.showModal}
              contentLabel="modal"
              overlayClassName="Overlay"
              onRequestClose={this.handleCloseModal}
              shouldCloseOnOverlayClick={true}
            >
              <span onClick={this.handleCloseModal}>X</span>
              <form
                onSubmit={async e => {
                  e.preventDefault()
                  await createEvent()
                  await this.handleCloseModal()
                  this.setState({
                    title: '',
                    description: '',
                    start: null,
                    end: null,
                    allDay: false,
                    upload: ''
                  })
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
                    <div>Event Start</div>
                    <DatePicker
                      selected={this.state.start}
                      onChange={this.handleStartDateChange}
                      placeholderText="Select start date"
                    />
                  </label>
                  <label htmlFor="end">
                    <div>Event End</div>
                    <DatePicker
                      selected={this.state.end}
                      onChange={this.handleEndDateChange}
                      placeholderText="Select end date"
                    />
                  </label>
                  <label htmlFor="description">
                    Description
                    <ReactQuill
                      placeholder="Add a description..."
                      theme="snow"
                      value={this.state.description}
                      onChange={this.onDescriptionChange}
                      modules={CreateEvent.modules}
                      formats={CreateEvent.formats}
                    />
                  </label>
                  <label htmlFor="file">
                    <button>
                      <button>Upload a File </button>
                      <input
                        type="file"
                        id="file"
                        name="file"
                        placeholder="Upload a file or image"
                        onChange={this.uploadFile}
                      />
                    </button>
                    {this.state.loading ? <p>Loading...</p> : null}
                    {this.state.upload && (
                      <div>
                        <a href={this.state.upload}>
                          {this.state.title}-Upload
                        </a>
                      </div>
                    )}
                  </label>
                  <button type="submit" disabled={this.state.loading}>
                    Add Event
                  </button>
                  <button
                    onClick={async e => {
                      e.preventDefault()
                      await this.setState({
                        email: this.props.email.join(', '),
                        loading: true
                      })

                      await createEvent()

                      await this.handleCloseModal()
                    }}
                    disabled={this.state.loading}
                  >
                    Add and Send Notification Email
                  </button>
                </fieldset>
              </form>
              <table>
                <thead>
                  <tr>
                    <td>Date</td>
                    <td>Title</td>
                    <td>Description</td>

                    <td>Upload</td>
                  </tr>
                </thead>
                <tbody key={this.state.title}>
                  <tr>
                    <td>{moment(this.state.end).format('MMM Do YYYY')}</td>
                    <td>{this.state.title}</td>
                    <td>{ReactHtmlParser(this.state.description)}</td>
                    {/* <td>{moment(start).format('MMM Do YYYY')}</td> */}
                    <td>
                      {this.state.upload && (
                        <a href={this.state.upload}>
                          <div>
                            <img src={FilePlaceholder} alt="File download" />
                            <span>{this.state.upload.split('.').pop()}</span>
                          </div>
                        </a>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </ReactModal>
          )}
        </Mutation>
      </IsAdminTeacher>
    )
  }
}

CreateEvent.modules = {
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

CreateEvent.formats = [
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

export default CreateEvent
export { CREATE_EVENT_MUTATION }
