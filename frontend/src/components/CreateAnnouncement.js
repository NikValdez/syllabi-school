import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ReactQuill from 'react-quill'
import ReactModal from 'react-modal'
import 'react-quill/dist/quill.snow.css'
import IsAdminTeacher from './IsAdminTeacher'
import Form from './styles/Form'
import styled from 'styled-components'
import { SINGLE_COURSE_QUERY } from './SingleCoursePDF'
import { ANNOUNCEMENTS_QUERY } from './Announcements'
import XIcon from './styles/XIcon'
import Button from './styles/Button'

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
    showModal: false
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
    this.setState({
      text: value
    })
  }

  render() {
    return (
      <IsAdminTeacher>
        <Button
          onClick={this.handleOpenAnnouncement}
          style={{ marginTop: '2rem' }}
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
                      />
                    </Quill>
                  </label>

                  <button type="submit" disabled={this.state.loading}>
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
