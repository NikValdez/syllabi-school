import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const MyCoursesStyles = styled.div`
  margin-top: 3rem;
`

const CURRENT_USER_QUERY_COURSES_EVENTS = gql`
  query {
    me {
      id
      email
      name
      permissions
      myCourses {
        courses {
          id
          title
          description
          courseCode
          events {
            id
            title
            description
            start
            end
          }
        }
      }
    }
  }
`

class MyCourses extends Component {
  render() {
    return (
      <MyCoursesStyles>
        <h3>My Courses</h3>
        <Query query={CURRENT_USER_QUERY_COURSES_EVENTS}>
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>
            if (error) return <p>Error : {error.message}</p>
            const courseData = data.me.myCourses.map(course => course.courses)
            const eventData = courseData.map(course => course.events)

            return courseData.map(course => (
              <ul key={course.id}>
                <Link to={`/courses/${course.id}`}>
                  <h3>{course.title}</h3>
                </Link>
              </ul>
            ))
          }}
        </Query>
      </MyCoursesStyles>
    )
  }
}

export default MyCourses
export { CURRENT_USER_QUERY_COURSES_EVENTS }
