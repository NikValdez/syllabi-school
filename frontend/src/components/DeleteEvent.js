import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { SINGLE_COURSE_QUERY } from './SingleCourse'

const DELETE_EVENT_MUTATION = gql`
  mutation DELETE_EVENT_MUTATION($id: ID!) {
    deleteEvent(id: $id) {
      id
    }
  }
`

export class DeleteEvent extends Component {
  render() {
    return (
      <Mutation
        mutation={DELETE_EVENT_MUTATION}
        variables={{ id: this.props.id }}
        refetchQueries={[
          { query: SINGLE_COURSE_QUERY, variables: { id: this.props.course } }
        ]}
      >
        {(deleteEvent, { error }) => (
          <span
            onClick={() => {
              if (
                window.confirm('Are you sure you want to delete this Event?')
              ) {
                deleteEvent()
              }
            }}
          >
            <button className="button">Delete</button>
          </span>
        )}
      </Mutation>
    )
  }
}

export default DeleteEvent
