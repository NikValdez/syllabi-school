import gql from 'graphql-tag'
import htmlToText from 'html-to-text'
import _ from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styled from 'styled-components'
import Form from './styles/Form'
import UploadButton from './styles/UploadButton'

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
      upload
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
    $upload: String
    $email: String
  ) {
    updateEvent(
      id: $id
      title: $title
      description: $description
      start: $start
      end: $end
      upload: $upload
      email: $email
    ) {
      id
      title
      description
      start
      end
      upload
    }
  }
`

class UpdateEvent extends Component {
  state = {
    loading: false
  }

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
    this.props.history.goBack()
  }
  updateEventWithEmail = async (e, updateEventMutation) => {
    e.preventDefault()
    await this.setState({ email: this.props.location.state.email.join(', ') })
    await updateEventMutation({
      variables: {
        id: this.props.match.params.id,
        ...this.state
      }
    })
    this.props.history.goBack()
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
          if (loading) return <p>Loading...</p>
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
                          moment(this.state.start).toDate() ||
                          moment(data.event.start).toDate()
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
                          moment(this.state.end).toDate() ||
                          moment(data.event.end).toDate()
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
                    <label htmlFor="file">
                      <UploadButton>
                        <button>Upload a File</button>
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
                            {_.truncate(this.state.upload, {
                              length: 24
                            })}
                          </a>
                        </UploadPreview>
                      )}
                    </label>

                    <button
                      type="submit"
                      style={{ marginBottom: '6rem', marginRight: '10px' }}
                    >
                      Update Changes
                    </button>

                    <button
                      onClick={async e => {
                        this.setState({
                          title: data.event.title,
                          description: data.event.description,
                          start: data.event.start,
                          end: data.event.end,
                          loading: true
                        })
                        await this.updateEventWithEmail(e, updateEvent).catch(
                          err => {
                            alert(err.message)
                          }
                        )
                      }}
                      disabled={this.state.loading}
                    >
                      Update and Send Notification Email
                    </button>
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
