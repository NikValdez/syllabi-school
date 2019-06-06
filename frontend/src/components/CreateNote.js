import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Error from './ErrorMessage'
import Notes, { NOTES_QUERY } from './Notes'

const CREATE_NOTE_MUTATION = gql`
  mutation CREATE_NOTE_MUTATION($note: String!) {
    createNote(note: $note) {
      id
    }
  }
`

class CreateNote extends Component {
  state = {
    note: ''
  }

  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  render() {
    return (
      <>
        <Notes />

        <Mutation
          mutation={CREATE_NOTE_MUTATION}
          variables={this.state}
          refetchQueries={[{ query: NOTES_QUERY }]}
        >
          {(createNote, { loading, error }) => (
            <div className="add-note full-width">
              <form
                onSubmit={async e => {
                  e.preventDefault()
                  if (
                    this.state.note.length > 0 &&
                    this.state.note.length < 100
                  ) {
                    await createNote()
                    this.setState({ note: '' })
                  } else {
                    alert('Note must be between 1 and 99 characters long')
                  }
                }}
              >
                <Error error={error} />

                <div className="field">
                  <input
                    className="input is-rounded"
                    type="text"
                    id="note"
                    name="note"
                    placeholder="Create a Note..."
                    required
                    value={this.state.note}
                    onChange={this.handleChange}
                  />
                </div>

                <div className="field">
                  <button className="button">Add Note</button>
                </div>
              </form>
            </div>
          )}
        </Mutation>
      </>
    )
  }
}

export default CreateNote
export { CREATE_NOTE_MUTATION }
