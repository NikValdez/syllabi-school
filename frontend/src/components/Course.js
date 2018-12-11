import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import DeleteCourse from './DeleteCourse'

class Course extends Component {
  render() {
    const { course } = this.props
    return (
      <div>
        <Link to="/course/:id">
          <h3>{course.title}</h3>
        </Link>
        <h6>{course.courseCode}</h6>
        <p>{course.description}</p>
        <p>Credits: {course.credits}</p>
        <DeleteCourse id={course.id}>Delete Course ❌</DeleteCourse>
      </div>
    )
  }
}

export default Course
