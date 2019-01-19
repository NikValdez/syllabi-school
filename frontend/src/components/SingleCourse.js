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
import Book from '../book.gif'
import CreateAnnouncement from './CreateAnnouncement'

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
          if (loading) return <img src={Book} alt="Loading" />
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

                <CreateAnnouncement course={course} />

                <h2 style={{ textAlign: 'center' }}>Announcements</h2>
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

                <CreateEventStyles>
                  <CreateEvent course={course} />
                </CreateEventStyles>

                <h2 style={{ textAlign: 'center' }}>Events</h2>
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
                )}
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
