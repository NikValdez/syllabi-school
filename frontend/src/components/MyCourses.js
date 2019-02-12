import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { DeleteMyCourse } from './DeleteMyCourse'
import ExportAsPdf from './ExportAsPdf'
import './styles/Modal.css'

const MyCoursesStyles = styled.div`
  margin-top: 3rem;
  a {
    display: inline-block;
    text-decoration: none;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0;
    font-size: 13px;
  }
  a::after {
    content: '';
    display: block;
    width: 0;
    height: 1px;
    background: #000;
    transition: width 0.3s;
  }
  a:hover::after {
    width: 100%;
    transition: width 0.3s;
  }
  .fa-plus {
    margin-left: 30px;
  }
`
const List = styled.div`
  /* display: grid;
  grid-template-columns: repeat(2, 1fr); */
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
          credits
          courseCode
          color
          events {
            id
            title
            description
            start
            end
            color
            upload
          }
          announcements {
            id
            clicked
            text
          }
        }
      }
    }
  }
`

class MyCourses extends Component {
  state = {
    showSyllabus: null
  }

  showSyllabus = i => {
    this.setState({
      showSyllabus: i
    })
  }
  hideSyllabus = i => {
    this.setState({
      showSyllabus: null
    })
  }
  render() {
    return (
      <MyCoursesStyles>
        <Query query={CURRENT_USER_QUERY_COURSES_EVENTS}>
          {({ data, error, loading }) => {
            if (loading) return <p />
            if (error) return <p>Error : {error.message}</p>
            const courseData = data.me.myCourses.map(course => course)
            return courseData.map((course, i) => (
              <List key={course.id}>
                <h3 style={{ margin: '0' }}>
                  <DeleteMyCourse id={course.id} color={course.courses.color} />
                  <Link to={`/courses/${course.courses.id}`}>
                    <p>
                      {course.courses.title} - {course.courses.courseCode}
                    </p>
                  </Link>
                  {this.state.showSyllabus && (
                    <span onClick={this.hideSyllabus}>
                      <i className="fas fa-minus" />
                    </span>
                  )}
                  {!this.state.showSyllabus && (
                    <span
                      onClick={this.showSyllabus.bind(this, (i = course.id))}
                    >
                      <i className="fas fa-plus" />
                    </span>
                  )}
                </h3>
                {course.id === this.state.showSyllabus && (
                  <ExportAsPdf id={course.courses.id} />
                )}
              </List>
            ))
          }}
        </Query>
      </MyCoursesStyles>
    )
  }
}

export default MyCourses
export { CURRENT_USER_QUERY_COURSES_EVENTS }
