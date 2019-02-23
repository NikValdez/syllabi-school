import gql from 'graphql-tag'
import moment from 'moment'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { DeleteMyCourse } from './DeleteMyCourse'
import ExportAsPdf from './ExportAsPdf'
import './styles/Modal.css'

const MyCoursesStyles = styled.div`
  margin-top: 3rem;
  a {
    display: inline-block;
    text-decoration: none;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0;
    font-size: 13px;
  }
  a::after {
    content: '';
    display: block;
    width: 0;
    height: 1px;
    background: #000;
    transition: width 0.3s;
  }
  a:hover::after {
    width: 100%;
    transition: width 0.3s;
  }
  .fa-plus,
  .fa-minus {
    float: right;
    @media (min-width: 768px) {
      margin-right: 5rem;
    }
    @media (min-width: 992px) {
      margin-right: 15rem;
    }
    @media (min-width: 435px) {
      margin-right: 3rem;
    }
    @media (min-width: 1200px) {
      margin-right: 15rem;
    }
  }
`

const List = styled.div`
  margin-bottom: 2rem;
  /* display: grid;
  grid-template-columns: repeat(2, 1fr); */
`

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
      <MyCoursesStyles>
        <h3>Courses</h3>
        <Query query={CURRENT_USER_QUERY_COURSES_EVENTS}>
          {({ data, error, loading }) => {
            if (loading) return <p />
            if (error) return <p>Error : {error.message}</p>
            const courseData = data.me.myCourses.map(course => course)

            return courseData.map((course, i) => (
              <List key={course.id}>
                <h3>
                  <DeleteMyCourse id={course.id} color={course.courses.color} />
                  <Link to={`/courses/${course.courses.id}`}>
                    <h5>
                      {course.courses.title} - {course.courses.courseCode}
                    </h5>
                  </Link>
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
                </h3>
                {course.id === this.state.showSyllabus &&
                  (course.courses.days !== null &&
                    JSON.parse(course.courses.days).map(day => (
                      <div key={day} style={{ display: 'inline-block' }}>
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
                              marginRight: '5px',
                              fontSize: '10px'
                            }}
                          >
                            {moment(course.courses.startDate).format('LT')}
                          </h6>
                          <h6
                            style={{
                              marginRight: '5px',
                              fontSize: '10px'
                            }}
                          >
                            {moment(course.courses.endDate).format('LT')}
                          </h6>
                        </div>
                      </div>
                    )))}

                {course.id === this.state.showSyllabus && (
                  <ExportAsPdf
                    id={course.courses.id}
                    institutionName={data.me.institution.name}
                    institutionLogo={data.me.institution.logo}
                  />
                )}
              </List>
            ))
          }}
        </Query>
      </MyCoursesStyles>
    )
  }
}

export default MyCourses
export { CURRENT_USER_QUERY_COURSES_EVENTS }
