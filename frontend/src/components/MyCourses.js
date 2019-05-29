import gql from 'graphql-tag'
import moment from 'moment'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import { DeleteMyCourse } from './DeleteMyCourse'
import ExportAsPdf from './ExportAsPdf'

const CURRENT_USER_QUERY_COURSES_EVENTS = gql`
  query {
    me {
      id
      email
      name
      institution {
        id
        name
        logo
      }
      permissions
      myCourses {
        id
        courses {
          id
          title
          description
          credits
          courseCode
          color
          days
          startDate
          endDate
          events {
            id
            title
            description
            start
            end
            color
            upload
          }
          announcements {
            id
            clicked
            text
          }
        }
      }
    }
  }
`

class MyCourses extends Component {
  state = {
    showSyllabus: null
  }

  showSyllabus = i => {
    this.setState({
      showSyllabus: i
    })
  }
  hideSyllabus = i => {
    this.setState({
      showSyllabus: null
    })
  }
  render() {
    return (
      <aside className="menu">
        <p className="menu-label">Your Courses</p>
        <ul className="courses menu-list">
          <Query query={CURRENT_USER_QUERY_COURSES_EVENTS}>
            {({ data, error, loading }) => {
              if (loading) return <p />
              if (error) return <p>Error : {error.message}</p>
              const courseData = data.me.myCourses.map(course => course)

              return courseData.map((course, i) => (
                <React.Fragment key={course.id}>
                  <li className="course mb-s">
                    <div className="full-width">
                      {course.id === this.state.showSyllabus && (
                        <button
                          style={{ background: course.courses.color }}
                          className="button is-small"
                          onClick={this.hideSyllabus.bind(
                            this,
                            (i = course.id)
                          )}
                        >
                          <i className="btr bt-minus" />
                        </button>
                      )}
                      {course.id !== this.state.showSyllabus && (
                        <button
                          style={{ background: course.courses.color }}
                          className="button is-small"
                          onClick={this.showSyllabus.bind(
                            this,
                            (i = course.id)
                          )}
                        >
                          <i className="btr bt-plus" />
                        </button>
                      )}

                      <Link to={`/courses/${course.courses.id}`}>
                        <h5>{course.courses.title}</h5>
                      </Link>

                      <DeleteMyCourse
                        id={course.id}
                        color={course.courses.color}
                      />
                    </div>

                    <div className="columns py">
                      {course.id === this.state.showSyllabus &&
                        (course.courses.days !== null &&
                          JSON.parse(course.courses.days).map(day => (
                            <div className="day column" key={day}>
                              <p>{day.toUpperCase()}</p>
                              <p>
                                {moment(course.courses.startDate).format('LT')}
                              </p>
                              <p>
                                {moment(course.courses.endDate).format('LT')}
                              </p>
                            </div>
                          )))}
                    </div>
                    {course.id === this.state.showSyllabus && (
                      <ExportAsPdf
                        id={course.courses.id}
                        institutionName={data.me.institution.name}
                        institutionLogo={data.me.institution.logo}
                      />
                    )}
                  </li>
                </React.Fragment>
              ))
            }}
          </Query>
        </ul>
      </aside>
    )
  }
}

export default MyCourses
export { CURRENT_USER_QUERY_COURSES_EVENTS }
