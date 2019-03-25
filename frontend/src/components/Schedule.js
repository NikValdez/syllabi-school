import moment from 'moment'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { Table } from 'react-bootstrap'
import ReactHtmlParser from 'react-html-parser'
import styled from 'styled-components'
import Book from '../book.gif'
import FilePlaceholder from '../images/filePlaceholder.png'
import { CURRENT_USER_QUERY_COURSES_EVENTS } from './MyCourses'
import TextExtension from './styles/TextExtension'

const ScheduleStyles = styled.div`
  margin: 20px;

  h3 {
    margin-top: 30px;
  }
  margin-bottom: 25rem;
`

export class Schedule extends Component {
  render() {
    return (
      <Query query={CURRENT_USER_QUERY_COURSES_EVENTS}>
        {({ data, error, loading }) => {
          if (loading) return <img src={Book} alt="Loading" />
          if (error) return <p>Error : {error.message}</p>
          const courseData = data.me.myCourses.map(
            course => course.courses.events
          )

          const courseColor = data.me.myCourses.map(course => {
            return (
              <div
                key={course.courses.id}
                style={{
                  display: 'inline-block',
                  marginRight: '15px',
                  float: 'right'
                }}
              >
                <p style={{ background: course.courses.color, padding: '5px' }}>
                  {course.courses.title}
                </p>
              </div>
            )
          })

          const color = courseColor.map(course => course)
          const merge = [].concat.apply([], courseData)
          const sortedByDates = merge.sort((a, b) => {
            return new Date(a.end).getTime() - new Date(b.end).getTime()
          })

          return (
            <ScheduleStyles>
              <h3>Full Schedule</h3>
              <div>{color}</div>
              <Table bordered>
                <thead>
                  <tr>
                    <td>Date</td>
                    <td>Title</td>
                    <td>Description</td>
                    <td>Upload</td>
                  </tr>
                </thead>
                {sortedByDates.map(course => (
                  <tbody key={course.id}>
                    <tr>
                      <td
                        style={{
                          background: course.color
                        }}
                      >
                        {moment(course.end).format('MMM Do YYYY')}
                      </td>
                      <td>{course.title}</td>
                      <td>{ReactHtmlParser(course.description)}</td>
                      <td>
                        {course.upload && (
                          <a href={course.upload}>
                            <div
                              style={{
                                position: 'relative',
                                textAlign: 'center'
                              }}
                            >
                              <img
                                src={FilePlaceholder}
                                alt="File download"
                                style={{ textAlign: 'center' }}
                              />
                              <TextExtension>
                                {course.upload.split('.').pop()}
                              </TextExtension>
                            </div>
                          </a>
                        )}
                      </td>
                    </tr>
                  </tbody>
                ))}
              </Table>
            </ScheduleStyles>
          )
        }}
      </Query>
    )
  }
}

export default Schedule
