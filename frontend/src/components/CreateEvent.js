import gql from 'graphql-tag'
import moment from 'moment'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { Table } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ReactHtmlParser from 'react-html-parser'
import ReactModal from 'react-modal'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import styled from 'styled-components'
import FilePlaceholder from '../images/filePlaceholder.png'
import IsAdminTeacher from './IsAdminTeacher'
import { SINGLE_COURSE_QUERY } from './SingleCourse'
import Button from './styles/Button'
import Form from './styles/Form'
import TextExtension from './styles/TextExtension'
import UploadButton from './styles/UploadButton'
import XIcon from './styles/XIcon'

const DatePick = styled.div`
  padding: 10px;
`
export const UploadPreview = styled.div`
  width: 200px;
`
export const Quill = styled.div`
  .quill {
    height: 10rem;
    margin-bottom: 5rem;
  }
`

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
        <Button
          onClick={this.handleOpenEvent}
          style={{ marginTop: '2rem', marginBottom: '1rem' }}
        >
          Create Event
        </Button>
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
              <span
                onClick={this.handleCloseModal}
                style={{ margin: '1rem', float: 'right' }}
              >
                <XIcon />
              </span>
              <Form
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
                    <DatePick>Assignment Start</DatePick>
                    <DatePicker
                      selected={this.state.start}
                      onChange={this.handleStartDateChange}
                      placeholderText="Select start date"
                    />
                  </label>
                  <label htmlFor="end">
                    <DatePick>Assignment End</DatePick>
                    <DatePicker
                      selected={this.state.end}
                      onChange={this.handleEndDateChange}
                      placeholderText="Select end date"
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
                        modules={CreateEvent.modules}
                        formats={CreateEvent.formats}
                      />
                    </Quill>
                  </label>
                  <label htmlFor="file">
                    <UploadButton>
                      <button>Upload a File </button>
                      <input
                        type="file"
                        id="file"
                        name="file"
                        placeholder="Upload a file or image"
                        onChange={this.uploadFile}
                      />
                    </UploadButton>
                    {this.state.loading ? <p>Loading...</p> : null}
                    {this.state.upload && (
                      <UploadPreview>
                        <a href={this.state.upload}>
                          {this.state.title}-Upload
                        </a>
                      </UploadPreview>
                    )}
                  </label>
                  <button
                    type="submit"
                    disabled={this.state.loading}
                    style={{ marginBottom: '5px', marginRight: '10px' }}
                  >
                    Add Assignment
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
              </Form>
              <Table bordered>
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
                          <div
                            style={{
                              position: 'relative',
                              textAlign: 'center'
                            }}
                          >
                            <img
                              src={FilePlaceholder}
                              alt="File download"
                              style={{ textAlign: 'center' }}
                            />
                            <TextExtension>
                              {this.state.upload.split('.').pop()}
                            </TextExtension>
                          </div>
                        </a>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
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
