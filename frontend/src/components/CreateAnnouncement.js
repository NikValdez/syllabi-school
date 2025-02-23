import gql from 'graphql-tag'
import moment from 'moment'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ReactHtmlParser from 'react-html-parser'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { ANNOUNCEMENTS_QUERY } from './Announcements'
import IsAdminTeacher from './IsAdminTeacher'
import { SINGLE_COURSE_QUERY } from './SingleCourse'

const CREATE_ANNOUNCEMENT_MUTATION = gql`
  mutation CREATE_ANNOUNCEMENT_MUTATION(
    $text: String!
    $date: DateTime!
    $course: ID!
    $clicked: Boolean
    $email: String
  ) {
    createAnnouncement(
      text: $text
      date: $date
      course: $course
      clicked: $clicked
      email: $email
    ) {
      id
    }
  }
`

class createAnnouncement extends Component {
  state = {
    text: '',
    date: null,
    clicked: true,
    course: this.props.course.id,
    loading: false,
    showModal: false,
    error: false,
    email: this.props.email.join(', ')
  }

  handleOpen = () => {
    this.setState({ showModal: true })
  }

  handleClose = () => {
    this.setState({ showModal: false })
  }

  handleDateChange = date => {
    this.setState({
      date
    })
  }

  onTextChange = value => {
    if (this.state.text.length < 260) {
      this.setState({
        text: value,
        error: false
      })
    } else {
      this.setState({
        error: true,
        text: value
      })
    }
  }

  render() {
    return (
      <IsAdminTeacher>
        <button className="button" onClick={this.handleOpen}>
          Create Announcement
        </button>
        <Mutation
          mutation={CREATE_ANNOUNCEMENT_MUTATION}
          variables={this.state}
          refetchQueries={[
            {
              query: SINGLE_COURSE_QUERY,
              variables: { id: this.props.course.id }
            },
            { query: ANNOUNCEMENTS_QUERY }
          ]}
        >
          {(createAnnouncement, { loading, error }) => (
            <div
              className={!this.state.showModal ? 'modal' : 'modal is-active'}
            >
              <div className="modal-background" onClick={this.handleClose} />
              <div className="modal-card">
                <header className="modal-card-head">
                  <p className="modal-card-title">Add Announcement</p>
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
                      this.setState({
                        loading: true
                      })
                      await createAnnouncement()
                      await this.handleClose()
                      this.setState({
                        text: '',
                        date: null,
                        loading: false
                      })
                    }}
                  >
                    <fieldset disabled={loading} aria-busy={loading}>
                      <div className="field">
                        <label className="label" htmlFor="date">
                          <div>Date</div>
                          <DatePicker
                            className="input"
                            selected={this.state.date}
                            onChange={this.handleDateChange}
                            placeholderText="Select Date"
                            required
                          />
                        </label>
                      </div>

                      <label className="label" htmlFor="text">
                        Anouncement
                        <ReactQuill
                          placeholder="Add Announcement Here..."
                          theme="snow"
                          value={this.state.text}
                          onChange={this.onTextChange}
                          maxlength="10"
                          style={{ height: '100px' }}
                        />
                        {this.state.error && (
                          <p>Announcement must be less than 260 characters</p>
                        )}
                      </label>
                      <div className="field" style={{ marginTop: '60px' }}>
                        <button
                          className="button is-black"
                          type="submit"
                          disabled={this.state.loading}
                        >
                          Submit
                        </button>
                      </div>
                    </fieldset>
                  </form>
                  <table className="table is-bordered is-fullwidth is-hoverable">
                    <thead>
                      <tr>
                        <td>Date</td>
                        <td>Announcement</td>
                      </tr>
                    </thead>
                    <tbody key={this.state.title}>
                      <tr>
                        <td>{moment(this.state.date).format('MMM Do YYYY')}</td>
                        <td>{ReactHtmlParser(this.state.text)}</td>
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

export default createAnnouncement
export { CREATE_ANNOUNCEMENT_MUTATION }
