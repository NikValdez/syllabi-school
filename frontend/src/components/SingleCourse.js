import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import styled from 'styled-components'
import CreateEvent from './CreateEvent'
import moment from 'moment'
import { TableStyles, TdSyles, ThSyles, TrSyles } from './styles/Table'

const SingleCourseStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: '0 12px 24px 0 rgba(0, 0, 0, 0.09)';
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`

const SINGLE_COURSE_QUERY = gql`
  query SINGLE_COURSE_QUERY($id: ID!) {
    course(where: { id: $id }) {
      id
      title
      description
      courseCode
      credits
      events {
        id
        title
        description
        start
        end
      }
    }
  }
`

class SingleCourse extends Component {
  state = {
    id: this.props.match.params.id
  }
  render() {
    return (
      <Query
        query={SINGLE_COURSE_QUERY}
        variables={{
          id: this.state.id
        }}
      >
        {({ error, loading, data }) => {
          if (error) return <p>Error</p>
          if (loading) return <p>Loading...</p>
          if (!data.course) return <p>No Course Found for {this.state.id}</p>
          const course = data.course
          return (
            <SingleCourseStyles>
              <div className="details">
                <h2>Course Title: {course.title}</h2>
                <p>Description: {course.description}</p>
                <p>Credits: {course.credits}</p>
                <p>Course Code: {course.courseCode}</p>
                <h3>Create Event</h3>
                <CreateEvent course={course.id} />
                <h2>Events</h2>
                <TableStyles style={{ border: '1px solid black' }}>
                  <tbody>
                    <tr>
                      <ThSyles>Title</ThSyles>
                      <ThSyles>Description</ThSyles>
                      <ThSyles>Start</ThSyles>
                      <ThSyles>End</ThSyles>
                    </tr>
                    {course.events.map(
                      ({ title, description, start, end, id }) => (
                        <TrSyles key={id}>
                          <TdSyles>{title}</TdSyles>
                          <TdSyles>{description}</TdSyles>
                          <TdSyles>
                            {moment({ start }).format('MMM Do YYYY')}{' '}
                          </TdSyles>
                          <TdSyles>
                            {moment({ end }).format('MMM Do YYYY')}{' '}
                          </TdSyles>
                        </TrSyles>
                      )
                    )}
                  </tbody>
                </TableStyles>
              </div>
            </SingleCourseStyles>
          )
        }}
      </Query>
    )
  }
}

export default SingleCourse
export { SINGLE_COURSE_QUERY }
