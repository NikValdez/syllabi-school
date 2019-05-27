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
      <div>
        <h3>Department</h3>
        <Query query={CURRENT_USER_QUERY_COURSES_EVENTS}>
          {({ data, error, loading }) => {
            if (loading) return <p />
            if (error) return <p>Error : {error.message}</p>
            const courseData = data.me.myCourses.map(course => course)

            return courseData.map((course, i) => (
              <React.Fragment key={course.id}>
                <ul>
                  <DeleteMyCourse id={course.id} color={course.courses.color} />

                  <Link to={`/courses/${course.courses.id}`}>
                    <h5>{course.courses.title}</h5>
                  </Link>

                  <div>
                    {course.id === this.state.showSyllabus && (
                      <span
                        onClick={this.hideSyllabus.bind(this, (i = course.id))}
                      >
                        <i className="fas fa-minus" />
                      </span>
                    )}
                    {course.id !== this.state.showSyllabus && (
                      <span
                        onClick={this.showSyllabus.bind(this, (i = course.id))}
                      >
                        <i className="fas fa-plus" />
                      </span>
                    )}
                  </div>
                </ul>
                {course.id === this.state.showSyllabus &&
                  (course.courses.days !== null &&
                    JSON.parse(course.courses.days).map(day => (
                      <div key={day}>
                        <h6>{day.toUpperCase()}</h6>

                        <h6>{moment(course.courses.startDate).format('LT')}</h6>
                        <h6>{moment(course.courses.endDate).format('LT')}</h6>
                      </div>
                    )))}

                {course.id === this.state.showSyllabus && (
                  <ExportAsPdf
                    id={course.courses.id}
                    institutionName={data.me.institution.name}
                    institutionLogo={data.me.institution.logo}
                  />
                )}
              </React.Fragment>
            ))
          }}
        </Query>
      </div>
    )
  }
}

export default MyCourses
export { CURRENT_USER_QUERY_COURSES_EVENTS }
