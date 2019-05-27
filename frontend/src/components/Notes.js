import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import DeleteNote from './DeleteNote'

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
      <div>
        <Query query={NOTES_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>
            if (error) return <p>Error : {error.message}</p>
            const notes = data.me.notes.map(note => note)

            return notes.map(note => (
              <ul key={note.id}>
                <li>
                  {note.note}
                  <DeleteNote id={note.id} />
                </li>
              </ul>
            ))
          }}
        </Query>
      </div>
    )
  }
}

export default Notes
export { NOTES_QUERY }
