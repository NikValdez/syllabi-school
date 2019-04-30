import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { CURRENT_USER_QUERY_COURSES_EVENTS } from './MyCourses'
import XIcon from './styles/XIcon'

const DELETE_MYCOURSE_MUTATION = gql`
  mutation DELETE_MYCOURSE_MUTATION($id: ID!) {
    deleteMyCourse(id: $id) {
      id
    }
  }
`

export class DeleteMyCourse extends Component {
  render() {
    return (
      <Mutation
        mutation={DELETE_MYCOURSE_MUTATION}
        variables={{ id: this.props.id }}
        refetchQueries={[{ query: CURRENT_USER_QUERY_COURSES_EVENTS }]}
      >
        {(deleteMyCourse, { error }) => (
          <span
            onClick={() => {
              if (
                window.confirm('Are you sure you want to delete this Course?')
              ) {
                deleteMyCourse()
              }
            }}
          >
            <div
              style={{
                background: this.props.color,
                width: '35px',
                padding: '5px'
              }}
            >
              <XIcon />
            </div>
          </span>
        )}
      </Mutation>
    )
  }
}
