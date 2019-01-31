import gql from 'graphql-tag'
import htmlToText from 'html-to-text'
import moment from 'moment'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import CreateAnnouncement from './CreateAnnouncement'
import CreateEvent from './CreateEvent'
import DeleteCourse from './DeleteCourse'
import DeleteEvent from './DeleteEvent'
import IsAdminTeacher from './IsAdminTeacher'
import { TableStyles, TdStyles, ThStyles, TrStyles } from './styles/Table'

const SingleCourseStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: '0 12px 24px 0 rgba(0, 0, 0, 0.09)';
  display: grid;

  min-height: 800px;
  a {
    color: black;
  }
  .update-delete {
    float: left;
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
    text-align: center;
  }
`

// const EventAnnouncement = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
// `
const CreateEventStyles = styled.div`
  grid-template-columns: start;
`
// const CreateAnnouncementStyles = styled.div`
//   grid-template-columns: end;
// `

const SINGLE_COURSE_QUERY = gql`
  query SINGLE_COURSE_QUERY($id: ID!) {
    course(where: { id: $id }) {
      id
      title
      description
      courseCode
      credits
      color
      events {
        id
        title
        description
        start
        end
        upload
        color
      }
      announcements {
        id
        text
        date
      }
    }
  }
`

class SingleCoursePDF extends Component {
  state = {
    id: this.props.id
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
              <IsAdminTeacher>
                <div className="update-delete">
                  <Link to={`/update/${course.id}`}>Update Course </Link>
                  <DeleteCourse id={this.state.id}>Delete ❌</DeleteCourse>
                </div>
              </IsAdminTeacher>
              <div className="details">
                <h2>Course Title: {course.title}</h2>
                <p>Description: {htmlToText.fromString(course.description)}</p>
                <p>Credits: {course.credits}</p>
                <p>Course Code: {course.courseCode}</p>

                <CreateEventStyles>
                  <CreateEvent course={course} />
                </CreateEventStyles>

                <h2 style={{ float: 'left' }}>Events</h2>
                {course.events.length < 1 ? (
                  <p>No Events Currently</p>
                ) : (
                  <TableStyles style={{ border: '1px solid black' }}>
                    <tbody>
                      <tr>
                        <ThStyles>Title</ThStyles>
                        <ThStyles>Description</ThStyles>
                        <ThStyles>Start</ThStyles>
                        <ThStyles>End</ThStyles>
                        <ThStyles>Upload</ThStyles>
                        <IsAdminTeacher>
                          <ThStyles>Edit/Delete</ThStyles>
                        </IsAdminTeacher>
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
                                <DeleteEvent id={id} course={course.id} />
                                <Link
                                  to={`/update_event/${id}`}
                                  style={{
                                    float: 'right',
                                    textDecoration: 'none',
                                    marginRight: '10px'
                                  }}
                                >
                                  ✏️
                                </Link>
                              </IsAdminTeacher>
                            </TdStyles>
                          </TrStyles>
                        )
                      )}
                    </tbody>
                  </TableStyles>
                )}
                <CreateAnnouncement course={course} />

                <h2 style={{ float: 'left' }}>Announcements</h2>
                {course.announcements.length < 1 ? (
                  <p>No Announcements Currently</p>
                ) : (
                  <TableStyles style={{ border: '1px solid black' }}>
                    <tbody>
                      <tr>
                        <ThStyles>Announcement</ThStyles>
                        <ThStyles>Date</ThStyles>
                      </tr>

                      {course.announcements.map(({ text, date, id }) => (
                        <TrStyles key={id}>
                          <TdStyles>{htmlToText.fromString(text)}</TdStyles>
                          <TdStyles>
                            {moment(date).format('MMM Do YYYY')}
                          </TdStyles>
                        </TrStyles>
                      ))}
                    </tbody>
                  </TableStyles>
                )}
              </div>
            </SingleCourseStyles>
          )
        }}
      </Query>
    )
  }
}

export default SingleCoursePDF
export { SINGLE_COURSE_QUERY }
