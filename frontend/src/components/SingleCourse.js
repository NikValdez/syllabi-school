import gql from 'graphql-tag'
import moment from 'moment'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { Col, Row, Table } from 'react-bootstrap'
import ReactHtmlParser from 'react-html-parser'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import FilePlaceholder from '../images/filePlaceholder.png'
import CreateAnnouncement from './CreateAnnouncement'
import CreateEvent from './CreateEvent'
import DeleteCourse from './DeleteCourse'
import DeleteEvent from './DeleteEvent'
import IsAdminTeacher from './IsAdminTeacher'
import Button from './styles/Button'
import TextExtension from './styles/TextExtension'

const SingleCourseStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;

  display: grid;

  min-height: 800px;
  a {
    color: black;
  }
  .update-delete {
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
      &:hover {
        background: #fffcdf;
        color: black;
      }
    }
  }

  .details {
    text-align: center;
    margin-top: -20rem;
  }
`
const CreateEventStyles = styled.div`
  grid-template-columns: start;
`

const SINGLE_COURSE_QUERY = gql`
  query SINGLE_COURSE_QUERY($id: ID!) {
    course(where: { id: $id }) {
      id
      title
      description
      courseCode
      credits
      color
      startDate
      endDate
      days
      events {
        id
        title
        description
        start
        end
        upload
        color
      }
      myCourse {
        user {
          email
        }
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
          if (loading) return <p>Loading...</p>
          if (!data.course)
            return <p>No Department Found for {this.state.id}</p>
          const course = data.course
          const email = data.course.myCourse.map(address => address.user.email)

          return (
            <SingleCourseStyles>
              <IsAdminTeacher>
                <span className="update-delete">
                  <Link to={`/update/${course.id}`}>Update Department </Link>
                  <span style={{ float: 'right' }}>
                    <DeleteCourse id={this.state.id}>
                      Delete Department
                    </DeleteCourse>
                  </span>
                </span>
              </IsAdminTeacher>
              <Row>
                <Col md={6} xs={6}>
                  <Table bordered responsive>
                    <tbody>
                      <tr>
                        <th>Title</th>
                        <td>{course.title}</td>
                      </tr>
                      <tr>
                        <th>Owner(s)</th>
                        <td>{course.courseCode}</td>
                      </tr>
                      <tr>
                        <th>Extension</th>
                        <td>{course.credits}</td>
                      </tr>
                      <tr>
                        <th>Office Hours</th>
                        <td>
                          {course.days !== null &&
                            JSON.parse(course.days).map(day => (
                              <div
                                key={day}
                                style={{ display: 'inline-block' }}
                              >
                                <h6
                                  style={{
                                    marginRight: '5px',
                                    fontSize: '10px',
                                    color: '#a09e9e'
                                  }}
                                >
                                  {day.toUpperCase()}
                                </h6>
                                <div style={{ display: 'inline-block' }}>
                                  <h6
                                    style={{
                                      marginRight: '20px',
                                      fontSize: '10px'
                                    }}
                                  >
                                    {moment(course.startDate).format('LT')}
                                  </h6>
                                  <h6
                                    style={{
                                      marginRight: '20px',
                                      fontSize: '10px'
                                    }}
                                  >
                                    {moment(course.endDate).format('LT')}
                                  </h6>
                                </div>
                              </div>
                            ))}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
              <div>
                <h3>Additional Information</h3>
                {ReactHtmlParser(course.description)}
              </div>
              <CreateEventStyles>
                <CreateEvent course={course} email={email} />
              </CreateEventStyles>
              <h2 style={{ float: 'left' }}>Department Schedule</h2>
              {course.events < 1 && <p>No Events Scheduled</p>}
              <Table bordered>
                <thead>
                  <tr>
                    <td>Edit</td>
                    <td>Date</td>
                    <td>Title</td>
                    <td>Description</td>
                    {/* <td>Start</td> */}
                    <td>Upload</td>
                    <td>Delete</td>
                  </tr>
                </thead>

                {course.events.map(
                  ({ title, description, start, end, id, upload }) => (
                    <tbody key={id}>
                      <tr>
                        <td>
                          <IsAdminTeacher>
                            <Link
                              to={{
                                pathname: `/update_event/${id}`,
                                state: { email }
                              }}
                            >
                              <Button>Edit</Button>
                            </Link>
                          </IsAdminTeacher>
                        </td>
                        <td>{moment(end).format('MMM Do YYYY')}</td>
                        <td>{title}</td>
                        <td>{ReactHtmlParser(description)}</td>
                        {/* <td>{moment(start).format('MMM Do YYYY')}</td> */}
                        <td>
                          {upload && (
                            <a href={upload} target="blank">
                              <div
                                style={{
                                  position: 'relative',
                                  textAlign: 'center'
                                }}
                              >
                                <img
                                  src={FilePlaceholder}
                                  alt="File download"
                                  style={{
                                    textAlign: 'center',
                                    height: '50px'
                                  }}
                                />
                                <TextExtension>
                                  {upload.split('.').pop()}
                                </TextExtension>
                              </div>
                            </a>
                          )}
                        </td>
                        <td
                          style={{
                            textAlign: 'center'
                          }}
                        >
                          <IsAdminTeacher>
                            <span>
                              <DeleteEvent id={id} course={course.id} />
                            </span>
                          </IsAdminTeacher>
                        </td>
                      </tr>
                    </tbody>
                  )
                )}
              </Table>

              <div className="detail">
                <CreateAnnouncement course={course} email={email} />
              </div>
              <h2 style={{ float: 'left' }}>Announcements</h2>
              {course.announcements.length < 1 && (
                <p>No Announcements Currently</p>
              )}

              <Table bordered>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Announcement</th>
                  </tr>

                  {course.announcements.map(({ text, date, id }) => (
                    <tr key={id}>
                      <td>{moment(date).format('MMM Do YYYY')}</td>
                      <td>{ReactHtmlParser(text)}</td>
                    </tr>
                  ))}
                </thead>
              </Table>
            </SingleCourseStyles>
          )
        }}
      </Query>
    )
  }
}

export default SingleCourse
export { SINGLE_COURSE_QUERY }
