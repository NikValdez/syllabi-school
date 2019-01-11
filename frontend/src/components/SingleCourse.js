import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import htmlToText from 'html-to-text'
import CreateEvent from './CreateEvent'
import moment from 'moment'
import { TableStyles, TdStyles, ThStyles, TrStyles } from './styles/Table'
import DeleteEvent from './DeleteEvent'
import DeleteCourse from './DeleteCourse'
import IsAdminTeacher from './IsAdminTeacher'

const SingleCourseStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: '0 12px 24px 0 rgba(0, 0, 0, 0.09)';
  display: grid;
  grid-auto-columns: 2fr;
  min-height: 800px;
  a {
    color: black;
  }
  .update-delete {
    float: right;
    a {
      margin-right: 2rem;
      background: black;
      color: white;
      font-weight: 500;
      border: 0;
      border-radius: 0;
      text-transform: uppercase;
      font-size: 1rem;
      padding: 0.5rem 1.2rem;
      display: inline-block;
      text-decoration: none;
    }
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    /* margin: 3rem; */
    /* font-size: 2rem; */
  }
`
const Upload = styled.div`
  width: 100px;
  height: 100px;
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
        upload
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
                <IsAdminTeacher>
                  <div className="update-delete">
                    <Link to={`/update/${course.id}`}>Update Course </Link>
                    <DeleteCourse id={this.state.id}>Delete ❌</DeleteCourse>
                  </div>
                </IsAdminTeacher>
                <h2>Course Title: {course.title}</h2>
                <p>Description: {htmlToText.fromString(course.description)}</p>
                <p>Credits: {course.credits}</p>
                <p>Course Code: {course.courseCode}</p>
                <CreateEvent course={course.id} />
                <h2>Events</h2>
                <TableStyles style={{ border: '1px solid black' }}>
                  <tbody>
                    <tr>
                      <ThStyles>Title</ThStyles>
                      <ThStyles>Description</ThStyles>
                      <ThStyles>Start</ThStyles>
                      <ThStyles>End</ThStyles>
                      <ThStyles>Upload</ThStyles>
                    </tr>

                    {course.events.map(
                      ({ title, description, start, end, id, upload }) => (
                        <TrStyles key={id}>
                          <TdStyles>{title}</TdStyles>
                          <TdStyles>
                            {htmlToText.fromString(description)}
                          </TdStyles>
                          <TdStyles>
                            {moment(start).format('MMM Do YYYY')}
                          </TdStyles>
                          <TdStyles>
                            {moment(end).format('MMM Do YYYY')}
                          </TdStyles>
                          <TdStyles>
                            {upload && <a href={upload}>{title}-Upload</a>}
                          </TdStyles>
                          <TdStyles>
                            <IsAdminTeacher>
                              <DeleteEvent id={id} course={course.id}>
                                Delete ❌
                              </DeleteEvent>
                            </IsAdminTeacher>
                          </TdStyles>
                        </TrStyles>
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
