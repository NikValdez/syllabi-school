import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import { link } from 'fs'

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
      <>
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
                </li>
              </ul>
            ))
          }}
        </Query>
      </>
    )
  }
}

export default Notes
export { NOTES_QUERY }
