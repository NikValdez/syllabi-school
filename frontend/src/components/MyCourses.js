import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { DeleteMyCourse } from './DeleteMyCourse'

const MyCoursesStyles = styled.div`
  margin-top: 3rem;
  a {
    color: #f9c321;
    -webkit-text-stroke: 0.5px black;
    display: inline-block;
    text-decoration: none;
    margin-bottom: -4rem;
  }
  a::after {
    content: '';
    display: block;
    width: 0;
    height: 1px;
    background: #000;
    transition: width 0.3s;
    margin-bottom: -4rem;
  }
  a:hover::after {
    width: 100%;
    transition: width 0.3s;
    margin-bottom: -4rem;
  }
`

const CURRENT_USER_QUERY_COURSES_EVENTS = gql`
  query {
    me {
      id
      email
      name
      permissions
      myCourses {
        id
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
            const courseData = data.me.myCourses.map(course => course)
            // const eventData = courseData.map(course => course.events
            return courseData.map(course => (
              <ul key={course.id}>
                <Link to={`/courses/${course.courses.id}`}>
                  <h3>{course.courses.title}</h3>
                </Link>
                <DeleteMyCourse id={course.id} />
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
