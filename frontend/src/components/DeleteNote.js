import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { NOTES_QUERY } from './Notes'
import styled from 'styled-components'
import XIcon from './styles/XIcon'

export const DeleteXStyles = styled.span`
  &:hover {
    transform: translate(2px, 0);
    transition: 0.2s ease-in-out;
  }
`

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
          <DeleteXStyles
            onClick={() => {
              if (
                window.confirm('Are you sure you want to delete this Note?')
              ) {
                deleteNote()
              }
            }}
          >
            <XIcon />
          </DeleteXStyles>
        )}
      </Mutation>
    )
  }
}

export default DeleteNote
