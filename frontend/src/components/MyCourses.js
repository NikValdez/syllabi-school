import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { DeleteMyCourse } from './DeleteMyCourse'
import './styles/Modal.css'

const MyCoursesStyles = styled.div`
  margin-top: 3rem;
  a {
    color: #f9c321;
    -webkit-text-stroke: 0.5px black;
    display: inline-block;
    text-decoration: none;
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
`
const List = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`

const AnnouncementStyles = styled.span`
  .mega-phone {
    margin-right: 5px;
  }
  .announcement {
    text-align: center;
  }
`

const UPDATE_ANNOUNCEMENT_MUTATION = gql`
  mutation UPDATE_ANNOUNCEMENT_MUTATION($id: ID!, $clicked: Boolean) {
    updateAnnouncement(id: $id, clicked: $clicked) {
      id
      clicked
    }
  }
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
  render() {
    return (
      <MyCoursesStyles>
        <Query query={CURRENT_USER_QUERY_COURSES_EVENTS}>
          {({ data, error, loading }) => {
            if (loading) return <p />
            if (error) return <p>Error : {error.message}</p>
            const courseData = data.me.myCourses.map(course => course)
            return courseData.map(course => (
              <List key={course.id}>
                <h3 style={{ margin: '0' }}>
                  <DeleteMyCourse id={course.id} color={course.courses.color} />

                  <Link to={`/courses/${course.courses.id}`}>
                    {course.courses.title}
                  </Link>
                </h3>
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
