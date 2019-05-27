import gql from 'graphql-tag'
import React, { Component } from 'react'
import Calendar from './Calendar'
import CreateNote from './CreateNote'
import MyCourses from './MyCourses'
import Search from './Search'

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

class Courses extends Component {
  render() {
    return (
      <div>
        <div>
          <Search />
          <MyCourses />
          <CreateNote />
        </div>
        <div>
          <Calendar />
        </div>
      </div>
    )
  }
}

export default Courses
export { ALL_COURSES_QUERY }
