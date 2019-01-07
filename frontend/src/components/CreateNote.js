import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import Notes from './Notes'
import { SearchStyles } from './styles/DropDown'
import { NOTES_QUERY } from './Notes'

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
    const { name, type, value } = e.target
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
            <SearchStyles>
              <form
                onSubmit={async e => {
                  e.preventDefault()
                  const res = await createNote()
                  this.setState({ note: '' })
                }}
              >
                <Error error={error} />

                <label htmlFor="note">
                  <input
                    type="text"
                    id="note"
                    name="note"
                    placeholder="Add a Note..."
                    required
                    value={this.state.note}
                    onChange={this.handleChange}
                  />
                </label>
              </form>
            </SearchStyles>
          )}
        </Mutation>
        <Notes />
      </>
    )
  }
}

export default CreateNote
export { CREATE_NOTE_MUTATION }
