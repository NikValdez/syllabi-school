import gql from 'graphql-tag'
import moment from 'moment'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import ReactHtmlParser from 'react-html-parser'
import { Link } from 'react-router-dom'
import FilePlaceholder from '../images/filePlaceholder.png'
import CreateAnnouncement from './CreateAnnouncement'
import CreateEvent from './CreateEvent'
import DeleteCourse from './DeleteCourse'
import DeleteEvent from './DeleteEvent'
import IsAdminTeacher from './IsAdminTeacher'

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
          //sort events by date
          const eventsByDate = course.events.sort(function(a, b) {
            return new Date(a.end) - new Date(b.end)
          })

          const email = data.course.myCourse.map(address => address.user.email)

          return (
            <section className="container py-m">
              <IsAdminTeacher>
                <div className="buttons mb-m">
                  <Link className="button" to={`/update/${course.id}`}>
                    Update Department{' '}
                  </Link>
                  <DeleteCourse id={this.state.id}>
                    Delete Department
                  </DeleteCourse>
                </div>
              </IsAdminTeacher>
              <table className="table full-width">
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
                          <div key={day} style={{ display: 'inline-block' }}>
                            <h6>{day.toUpperCase()}</h6>
                            <div>
                              <h6>{moment(course.startDate).format('LT')}</h6>
                              <h6>{moment(course.endDate).format('LT')}</h6>
                            </div>
                          </div>
                        ))}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mb-m">
                <h3>Additional Information</h3>
                {ReactHtmlParser(course.description)}
              </div>

              <div className="mb-m">
                <CreateEvent course={course} email={email} />
              </div>

              <h2>Department Schedule</h2>
              {course.events < 1 && <p>No Events Scheduled</p>}
              <table className="table full-width">
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

                {eventsByDate.map(
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
                              <button>Edit</button>
                            </Link>
                          </IsAdminTeacher>
                        </td>
                        <td>{moment(end).format('MMM Do YYYY')}</td>
                        <td>{title}</td>
                        <td>{ReactHtmlParser(description)}</td>

                        <td>
                          {upload && (
                            <a href={upload} target="blank">
                              <div>
                                <img
                                  src={FilePlaceholder}
                                  alt="File download"
                                />
                                <span>{upload.split('.').pop()}</span>
                              </div>
                            </a>
                          )}
                        </td>
                        <td>
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
              </table>

              <section className="announcements">
                <h2>Announcements</h2>

                {course.announcements.length < 1 && (
                  <p>There are currently no announcements.</p>
                )}

                <table className="table full-width">
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
                </table>

                <CreateAnnouncement course={course} email={email} />
              </section>
            </section>
          )
        }}
      </Query>
    )
  }
}

export default SingleCourse
export { SINGLE_COURSE_QUERY }
