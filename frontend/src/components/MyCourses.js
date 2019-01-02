import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

const CURRENT_USER_QUERY = gql`
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
      <Query query={CURRENT_USER_QUERY}>
        {({ data, error, loading }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error : {error.message}</p>
          const courseData = data.me.myCourses.map(course => course.courses)
          const eventData = courseData.map(course => course.events)
          console.log(eventData)

          return courseData.map(course => (
            <ul key={course.id}>
              <Link to={`/courses/${course.id}`}>
                <h3>{course.title}</h3>
              </Link>
            </ul>
          ))
        }}
      </Query>
    )
  }
}

export default MyCourses
