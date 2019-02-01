import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import styled from 'styled-components'
import Book from '../book.gif'
import DeleteNote from './DeleteNote'

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
        <Query query={NOTES_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return <img src={Book} alt="Loading" />
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
