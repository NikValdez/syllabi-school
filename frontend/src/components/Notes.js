import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import DeleteNote from './DeleteNote'
import styled from 'styled-components'

const NotesStyles = styled.div`
  li {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
`

const NOTES_QUERY = gql`
  query {
    me {
      id

      notes {
        id
        note
      }
    }
  }
`

class Notes extends Component {
  render() {
    return (
      <NotesStyles>
        <h3>Notes</h3>
        <Query query={NOTES_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>
            if (error) return <p>Error : {error.message}</p>
            const notes = data.me.notes.map(note => note)
            return notes.map(note => (
              <ul key={note.id}>
                <li
                  style={{
                    listStyleType: 'none'
                  }}
                >
                  {note.note}
                  <DeleteNote id={note.id} />
                </li>
              </ul>
            ))
          }}
        </Query>
      </NotesStyles>
    )
  }
}

export default Notes
export { NOTES_QUERY }
