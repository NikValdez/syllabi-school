import gql from 'graphql-tag'
import htmlToText from 'html-to-text'
import moment from 'moment'
import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styled from 'styled-components'
import Book from '../book.gif'
import Form from './styles/Form'

const DatePick = styled.div`
  padding: 10px;
`
const UploadPreview = styled.div`
  width: 200px;
`

const EDIT_EVENT_QUERY = gql`
  query EDIT_EVENT_QUERY($id: ID!) {
    event(where: { id: $id }) {
      id
      title
      description
      start
      end
    }
  }
`
const UPDATE_EVENT_MUTATION = gql`
  mutation UPDATE_EVENT_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $start: DateTime
    $end: DateTime
  ) {
    updateEvent(
      id: $id
      title: $title
      description: $description
      start: $start
      end: $end
    ) {
      id
      title
      description
      start
      end
    }
  }
`

class UpdateEvent extends Component {
  state = {}

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val })
  }

  updateEvent = async (e, updateEventMutation) => {
    e.preventDefault()
    await updateEventMutation({
      variables: {
        id: this.props.match.params.id,
        ...this.state
      }
    })
    this.props.history.push(`/courses/${this.props.match.params.id}`)
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
      <Query
        query={EDIT_EVENT_QUERY}
        variables={{
          id: this.props.match.params.id
        }}
      >
        {({ data, loading }) => {
          if (loading) return <img src={Book} alt="Loading" />
          if (!data)
            return <p>No Events Found For ID {this.props.match.params.id}</p>
          return (
            <Mutation mutation={UPDATE_EVENT_MUTATION} variables={this.state}>
              {(updateEvent, { loading, error }) => (
                <Form
                  onSubmit={e =>
                    this.updateEvent(e, updateEvent).catch(err => {
                      alert(err.message)
                    })
                  }
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
                        defaultValue={data.event.title}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="start">
                      <DatePick>Event Start</DatePick>
                      <DatePicker
                        selected={
                          this.state.start || moment(data.event.start).toDate()
                        }
                        openToDate={moment(data.event.start).toDate()}
                        onChange={this.handleStartDateChange}
                        placeholderText="Click to select start date"
                      />
                    </label>
                    <label htmlFor="end">
                      <DatePick>Event End</DatePick>
                      <DatePicker
                        selected={
                          this.state.end || moment(data.event.end).toDate()
                        }
                        openToDate={moment(data.event.end).toDate()}
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
                        defaultValue={htmlToText.fromString(
                          data.event.description
                        )}
                        onChange={this.handleChange}
                      />
                    </label>

                    <button type="submit">Save Changes</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}

UpdateEvent.modules = {
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

UpdateEvent.formats = [
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

export default UpdateEvent
export { UPDATE_EVENT_MUTATION }
