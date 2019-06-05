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
      color
    }
  }
`

class Courses extends Component {
  render() {
    return (
      <section className="courses container py-l">
        <div className="columns">
          <div className="column left is-narrow">
            <div className="panel">
              <p className="panel-heading m0">Courses</p>
              <div className="panel-block">
                <Search />
              </div>
              <div className="panel-block">
                <MyCourses />
              </div>
            </div>

            <div className="panel">
              <p className="panel-heading m0">Notes</p>
              <div className="panel-block">
                <CreateNote />
              </div>
            </div>
          </div>
          <div className="column right">
            <Calendar />
          </div>
        </div>
      </section>
    )
  }
}

export default Courses
export { ALL_COURSES_QUERY }
