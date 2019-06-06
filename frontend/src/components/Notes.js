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
      <section className="notes mb-s full-width">
        <div className="tags are-medium pt">
          <Query query={NOTES_QUERY}>
            {({ data, error, loading }) => {
              if (loading) return <p>Loading...</p>
              if (error)
                return (
                  <div className="error">
                    <p>Error : {error.message}</p>
                  </div>
                )
              const notes = data.me.notes.map(note => note)

              return notes.map(note => (
                <span className="note tag" key={note.id}>
                  {note.note}
                  <DeleteNote id={note.id} />
                </span>
              ))
            }}
          </Query>
        </div>
      </section>
    )
  }
}

export default Notes
export { NOTES_QUERY }
