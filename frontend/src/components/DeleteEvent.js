import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { SINGLE_COURSE_QUERY } from './SingleCourse'
import DeleteButton from './styles/DeleteButton'

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
          <DeleteButton
            onClick={() => {
              if (
                window.confirm('Are you sure you want to delete this Event?')
              ) {
                deleteEvent()
              }
            }}
          >
            {this.props.children}
          </DeleteButton>
        )}
      </Mutation>
    )
  }
}

export default DeleteEvent
