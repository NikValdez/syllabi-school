import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'

const CREATE_EVENT_MUTATION = gql`
  mutation CREATE_EVENT_MUTATION(
    $title: String!
    $description: String!
    $start: DateTime!
    $end: DateTime!
    $allDay: Boolean
    $course: ID!
  ) {
    createEvent(
      title: $title
      description: $description
      start: $start
      end: $end
      allDay: $allDay
      course: $course
    ) {
      id
    }
  }
`

class CreateEvent extends Component {
  state = {
    title: '',
    description: '',
    start: '',
    end: '',
    allDay: false,
    course: this.props.course
  }

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val })
  }
  render() {
    // console.log(this.props.course)
    return (
      <Mutation mutation={CREATE_EVENT_MUTATION} variables={this.state}>
        {(createEvent, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault()
              const res = await createEvent()
              console.log(res)
              this.setState({
                title: '',
                description: '',
                start: '',
                end: '',
                allDay: false
              })
              // this.props.history.push(`/`)
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
                Event Start
                <input
                  type="text"
                  id="start"
                  name="start"
                  placeholder="Start"
                  required
                  value={this.state.start}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="end">
                Event End
                <input
                  type="text"
                  id="end"
                  name="end"
                  placeholder="End"
                  required
                  value={this.state.end}
                  onChange={this.handleChange}
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
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default CreateEvent
export { CREATE_EVENT_MUTATION }
