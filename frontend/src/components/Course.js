// import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
// import htmlToText from 'html-to-text'
// import DeleteCourse from './DeleteCourse'
// import AddCourse from './AddCourse'

// class Course extends Component {
//   render() {
//     const { course } = this.props
//     return (
//       <div>
//         <Link to={`/courses/${course.id}`}>
//           <h3>{course.title}</h3>
//         </Link>
//         <h6>{course.courseCode}</h6>
//         <p>{htmlToText.fromString(course.description)}</p>
//         <p>Credits: {course.credits}</p>
//         <DeleteCourse id={course.id}>Delete ❌</DeleteCourse>
//         <AddCourse id={course.id} />
//       </div>
//     )
//   }
// }

// export default Course
