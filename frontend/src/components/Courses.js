import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import Course from './Course'
import Calendar from './Calendar'

const ALL_COURSES_QUERY = gql`
  query ALL_COURSES_QUERY {
    courses {
      id
      title
      description
      courseCode
      credits
      image
    }
  }
`
const Center = styled.div`
  text-align: center;
`

const CoursesList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: 1000px;
`

class Courses extends Component {
  render() {
    return (
      <Center>
        <h3>Course List</h3>
        <Query query={ALL_COURSES_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>
            if (error) return <p>Error : {error.message}</p>
            console.log(data)
            return (
              <CoursesList>
                {data.courses.map(course => (
                  <Course course={course} key={course.id} />
                ))}
              </CoursesList>
            )
          }}
        </Query>
        <Calendar />
      </Center>
    )
  }
}

export default Courses
export { ALL_COURSES_QUERY }
