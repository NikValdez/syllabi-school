import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import DeleteCourse from './DeleteCourse'
import CreateEvent from './CreateEvent'

class Course extends Component {
  render() {
    const { course } = this.props
    console.log(course.id)
    return (
      <div>
        <Link to={`/courses/${course.id}`}>
          <h3>{course.title}</h3>
        </Link>
        <h6>{course.courseCode}</h6>
        <p>{course.description}</p>
        <p>Credits: {course.credits}</p>
        <DeleteCourse id={course.id}>Delete Course ❌</DeleteCourse>
        <CreateEvent course={course.id} />
      </div>
    )
  }
}

export default Course
