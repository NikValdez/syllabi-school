import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import Course from './Course'
import Calendar from './Calendar'
import { Link } from 'react-router-dom'
import { CURRENT_USER_QUERY } from './User'
import MyCourses from './MyCourses'
import Search from './Search'
import IsAdminTeacher from './IsAdminTeacher'
import CreateNote from './CreateNote'

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
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  @media (max-width: 620px) {
    grid-template-columns: repeat(4, 1fr);
  }
`
const LeftSide = styled.div`
  grid-column-start: span 2;
`

const RightSide = styled.div`
  grid-column-end: span 4;
`

class Courses extends Component {
  render() {
    return (
      <Center>
        <LeftSide>
          <Search />
          <MyCourses />
          <CreateNote />
        </LeftSide>

        {/* <Query query={ALL_COURSES_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>
            if (error) return <p>Error : {error.message}</p>
            // console.log(data)
            return (
              <CoursesList>
                {data.courses.map(course => (
                  <Course course={course} key={course.id} />
                ))}
              </CoursesList>
            )
          }}
        </Query> */}

        <RightSide>
          <Calendar />
        </RightSide>
      </Center>
    )
  }
}

export default Courses
export { ALL_COURSES_QUERY }
