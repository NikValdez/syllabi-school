import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import IsAdminTeacher from './IsAdminTeacher'
import Form from './styles/Form'
import styled from 'styled-components'
import { SINGLE_COURSE_QUERY } from './SingleCourse'

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

class createAnnouncement extends Component {
  state = {
    text: '',
    date: null,
    clicked: true,
    course: this.props.course.id,
    loading: false
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
        <h3>Create Announcement</h3>
        <Mutation
          mutation={CREATE_ANNOUNCEMENT_MUTATION}
          variables={this.state}
          refetchQueries={[
            {
              query: SINGLE_COURSE_QUERY,
              variables: { id: this.props.course.id }
            }
          ]}
        >
          {(createAnnouncement, { loading, error }) => (
            <Form
              onSubmit={async e => {
                e.preventDefault()
                await createAnnouncement()
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
          )}
        </Mutation>
      </IsAdminTeacher>
    )
  }
}

export default createAnnouncement
export { CREATE_ANNOUNCEMENT_MUTATION }
