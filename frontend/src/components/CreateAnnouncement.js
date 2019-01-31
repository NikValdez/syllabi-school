import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ReactModal from 'react-modal'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import styled from 'styled-components'
import { ANNOUNCEMENTS_QUERY } from './Announcements'
import IsAdminTeacher from './IsAdminTeacher'
import { SINGLE_COURSE_QUERY } from './SingleCoursePDF'
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
  ) {
    createAnnouncement(
      text: $text
      date: $date
      course: $course
      clicked: $clicked
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
    error: false
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
        <Button
          onClick={this.handleOpenAnnouncement}
          style={{ margin: '2rem', float: 'right' }}
        >
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
                      placeholderText="Click to select start date"
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
            </ReactModal>
          )}
        </Mutation>
      </IsAdminTeacher>
    )
  }
}

export default createAnnouncement
export { CREATE_ANNOUNCEMENT_MUTATION }
