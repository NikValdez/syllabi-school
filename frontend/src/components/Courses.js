import React, { Component } from 'react'
import gql from 'graphql-tag'
import styled from 'styled-components'
import Calendar from './Calendar'
import MyCourses from './MyCourses'
import Search from './Search'
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
        <RightSide>
          <Calendar />
        </RightSide>
      </Center>
    )
  }
}

export default Courses
export { ALL_COURSES_QUERY }
