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
        <Mutation
          mutation={CREATE_NOTE_MUTATION}
          variables={this.state}
          refetchQueries={[{ query: NOTES_QUERY }]}
        >
          {(createNote, { loading, error }) => (
            <div>
              <form
                onSubmit={async e => {
                  e.preventDefault()
                  if (this.state.note.length > 0) {
                    await createNote()
                    this.setState({ note: '' })
                  }
                }}
              >
                <Error error={error} />

                <input
                  type="text"
                  id="note"
                  name="note"
                  placeholder="Add a Note..."
                  required
                  value={this.state.note}
                  onChange={this.handleChange}
                />
                <button>Add</button>
              </form>
            </div>
          )}
        </Mutation>
        <Notes />
      </>
    )
  }
}

export default CreateNote
export { CREATE_NOTE_MUTATION }
