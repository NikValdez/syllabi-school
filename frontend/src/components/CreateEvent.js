import gql from 'graphql-tag'
import moment from 'moment'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ReactHtmlParser from 'react-html-parser'
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
  handleOpen = () => {
    this.setState({ showModal: true })
  }

  handleClose = () => {
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
        <button className="button" onClick={this.handleOpen}>
          Create Assignment
        </button>
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
            <div
              className={!this.state.showModal ? 'modal' : 'modal is-active'}
            >
              <div className="modal-background" onClick={this.handleClose} />
              <div className="modal-card">
                <header className="modal-card-head">
                  <p className="modal-card-title">Add Assignment</p>
                  <button
                    className="delete"
                    aria-label="close"
                    onClick={this.handleClose}
                  />
                </header>
                <section className="modal-card-body">
                  <form
                    onSubmit={async e => {
                      e.preventDefault()
                      await createEvent()
                      this.setState({
                        title: '',
                        description: '',
                        start: null,
                        end: null,
                        allDay: false,
                        upload: '',
                        loading: false
                      })
                      await this.handleClose()
                    }}
                  >
                    <fieldset disabled={loading} aria-busy={loading}>
                      <div className="field">
                        <label className="label" htmlFor="title">
                          Title
                          <input
                            className="input"
                            type="text"
                            id="title"
                            name="title"
                            placeholder="title"
                            required
                            value={this.state.title}
                            onChange={this.handleChange}
                          />
                        </label>
                      </div>
                      <label htmlFor="start">
                        <div>Assignment Start</div>
                        <DatePicker
                          className="input"
                          selected={this.state.start}
                          onChange={this.handleStartDateChange}
                          placeholderText="Select start date"
                        />
                      </label>
                      <label htmlFor="end">
                        <div>Assignment End</div>
                        <DatePicker
                          className="input"
                          selected={this.state.end}
                          onChange={this.handleEndDateChange}
                          placeholderText="Select end date"
                        />
                      </label>
                      <label htmlFor="description">
                        Description
                        <ReactQuill
                          style={{ height: '100px' }}
                          placeholder="Add a description..."
                          theme="snow"
                          value={this.state.description}
                          onChange={this.onDescriptionChange}
                          modules={CreateEvent.modules}
                          formats={CreateEvent.formats}
                        />
                      </label>
                      <div className="field">
                        <label className="label" htmlFor="file">
                          <div className="file">
                            <label className="file-label">
                              <input
                                className="file-input"
                                type="file"
                                id="file"
                                name="file"
                                onChange={this.uploadFile}
                              />
                              <span className="file-cta">
                                <span className="file-icon">
                                  <i className="fas fa-upload" />
                                </span>
                                <span className="file-label">
                                  Upload a file…
                                </span>
                              </span>
                            </label>
                          </div>
                          {this.state.loading ? <p>Loading...</p> : null}
                          {this.state.upload && (
                            <div>
                              <a href={this.state.upload}>
                                {this.state.title}-Upload
                              </a>
                            </div>
                          )}
                        </label>
                      </div>
                      <div className="field">
                        <button
                          className="button is-black"
                          type="submit"
                          disabled={this.state.loading}
                        >
                          Add Assignment
                        </button>
                      </div>

                      <button
                        className="button is-black"
                        onClick={async e => {
                          e.preventDefault()
                          await this.setState({
                            email: this.props.email.join(', ')
                          })

                          await createEvent()
                          await this.setState({
                            title: '',
                            description: '',
                            start: null,
                            end: null,
                            allDay: false,
                            upload: '',
                            loading: false
                          })

                          await this.handleClose()
                        }}
                        disabled={this.state.loading}
                      >
                        Add and Send Notification Email
                      </button>
                    </fieldset>
                  </form>
                  <table className="table is-bordered is-fullwidth is-hoverable">
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
                                <img
                                  src={FilePlaceholder}
                                  alt="File download"
                                />
                                <span>
                                  {this.state.upload.split('.').pop()}
                                </span>
                              </div>
                            </a>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>
              </div>
            </div>
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
