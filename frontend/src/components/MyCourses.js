import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { DeleteMyCourse } from './DeleteMyCourse'
import ReactModal from 'react-modal'
import htmlToText from 'html-to-text'
import './styles/Modal.css'
import XIcon from './styles/XIcon'
import { DeleteXStyles } from './DeleteNote'

const MyCoursesStyles = styled.div`
  margin-top: 3rem;
  a {
    color: #f9c321;
    -webkit-text-stroke: 0.5px black;
    display: inline-block;
    text-decoration: none;
    margin-bottom: -4rem;
  }
  a::after {
    content: '';
    display: block;
    width: 0;
    height: 1px;
    background: #000;
    transition: width 0.3s;
    margin-bottom: -4rem;
  }
  a:hover::after {
    width: 100%;
    transition: width 0.3s;
    margin-bottom: -4rem;
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
ReactModal.setAppElement('#root')

class MyCourses extends Component {
  state = {
    showModal: false,
    message: ''
  }

  handleOpenModal = data => {
    this.setState({ showModal: true, message: data })
  }

  handleCloseModal = () => {
    this.setState({ showModal: false })
  }

  render() {
    return (
      <MyCoursesStyles>
        <h3>My Courses</h3>
        <Query query={CURRENT_USER_QUERY_COURSES_EVENTS}>
          {({ data, error, loading }) => {
            if (loading) return <p />
            if (error) return <p>Error : {error.message}</p>
            const courseData = data.me.myCourses.map(course => course)
            return courseData.map(course => (
              <List key={course.id}>
                <h3>
                  {course.courses.announcements.map(announcement => (
                    <Mutation
                      mutation={UPDATE_ANNOUNCEMENT_MUTATION}
                      variables={{ id: announcement.id, clicked: false }}
                      key={announcement.id}
                    >
                      {(updateAnnouncement, { loading, error }) => (
                        <AnnouncementStyles>
                          <span
                            onClick={() => {
                              this.handleOpenModal(announcement.text)
                              // updateAnnouncement()
                            }}
                            className="mega-phone"
                          >
                            {announcement.clicked ? '📣' : null}
                          </span>
                          <ReactModal
                            isOpen={this.state.showModal}
                            contentLabel="modal"
                            className="Modal"
                            overlayClassName="Overlay"
                            onRequestClose={this.handleCloseModal}
                            shouldCloseOnOverlayClick={true}
                          >
                            <span
                              onClick={this.handleCloseModal}
                              style={{
                                margin: '1rem',
                                float: 'right'
                              }}
                            >
                              <XIcon />
                            </span>
                            <div style={{ textAlign: 'center' }}>
                              <h1 style={{ borderBottom: '1px solid #f9c321' }}>
                                Announcement
                              </h1>
                              <h3>
                                {htmlToText.fromString(this.state.message)}
                              </h3>
                            </div>
                          </ReactModal>
                        </AnnouncementStyles>
                      )}
                    </Mutation>
                  ))}

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
