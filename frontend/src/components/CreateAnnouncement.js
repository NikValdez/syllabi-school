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
import { ANNOUNCEMENTS_QUERY } from './Announcements'
import IsAdminTeacher from './IsAdminTeacher'
import { SINGLE_COURSE_QUERY } from './SingleCourse'
import Button from './styles/Button'
import Form from './styles/Form'
import XIcon from './styles/XIcon'

const DatePick = styled.div`
  padding: 10px;
`
export const Quill = styled.div`
  .quill {
    height: 10rem;
    margin-bottom: 5rem;
  }
`

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

ReactModal.setAppElement('#root')

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

  handleOpenAnnouncement = () => {
    this.setState({ showModal: true })
  }

  handleCloseModal = () => {
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
        <Button onClick={this.handleOpenAnnouncement}>
          Create Announcement
        </Button>
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
                  this.setState({
                    loading: true
                  })
                  await createAnnouncement()
                  await this.handleCloseModal()
                  this.setState({
                    text: '',
                    date: null
                  })
                }}
              >
                <fieldset disabled={loading} aria-busy={loading}>
                  <label htmlFor="date">
                    <DatePick>Date</DatePick>
                    <DatePicker
                      selected={this.state.date}
                      onChange={this.handleDateChange}
                      placeholderText="Select Date"
                    />
                  </label>

                  <label htmlFor="text">
                    Anouncement
                    <Quill>
                      <ReactQuill
                        placeholder="Add Announcement Here..."
                        theme="snow"
                        value={this.state.text}
                        onChange={this.onTextChange}
                        maxlength="10"
                      />
                    </Quill>
                    {this.state.error && (
                      <p style={{ color: '#FF0033' }}>
                        Announcement must be less than 260 characters
                      </p>
                    )}
                  </label>

                  <button
                    type="submit"
                    disabled={this.state.loading || this.state.error}
                  >
                    Submit
                  </button>
                </fieldset>
              </Form>
              <Table bordered>
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
              </Table>
            </ReactModal>
          )}
        </Mutation>
      </IsAdminTeacher>
    )
  }
}

export default createAnnouncement
export { CREATE_ANNOUNCEMENT_MUTATION }
