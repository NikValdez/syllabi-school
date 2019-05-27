import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { NOTES_QUERY } from './Notes'

const DELETE_NOTE_MUTATION = gql`
  mutation DELETE_NOTE_MUTATION($id: ID!) {
    deleteNote(id: $id) {
      id
    }
  }
`

class DeleteNote extends Component {
  render() {
    return (
      <Mutation
        mutation={DELETE_NOTE_MUTATION}
        variables={{ id: this.props.id }}
        refetchQueries={[{ query: NOTES_QUERY }]}
      >
        {(deleteNote, { error }) => (
          <div
            onClick={() => {
              if (
                window.confirm('Are you sure you want to delete this Note?')
              ) {
                deleteNote()
              }
            }}
          >
            X
          </div>
        )}
      </Mutation>
    )
  }
}

export default DeleteNote
