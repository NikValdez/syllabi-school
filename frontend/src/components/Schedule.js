import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { CURRENT_USER_QUERY_COURSES_EVENTS } from './MyCourses'
import moment from 'moment'
import htmlToText from 'html-to-text'
import { TableStyles, TdStyles, ThStyles, TrStyles } from './styles/Table'
import styled from 'styled-components'
import Book from '../book.gif'

const ScheduleStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  @media (max-width: 620px) {
    grid-template-columns: repeat(1, 1fr);
  }
  li {
    list-style-type: none;
    margin: 1rem;
  }
  a {
    color: black;
  }
`

export class Schedule extends Component {
  render() {
    return (
      <ScheduleStyles>
        <Query query={CURRENT_USER_QUERY_COURSES_EVENTS}>
          {({ data, error, loading }) => {
            if (loading) return <img src={Book} alt="Loading" />
            if (error) return <p>Error : {error.message}</p>
            const courseData = data.me.myCourses.map(course => course)
            // const eventData = courseData.map(course => course.events
            return courseData.map(course => (
              <>
                <div key={course.id}>
                  <h3> {course.courses.title}</h3>
                  <li>{htmlToText.fromString(course.courses.description)}</li>
                  <li>Course Code: {course.courses.courseCode}</li>
                  <li>Credits: {course.courses.credits}</li>
                </div>

                <TableStyles
                  style={{ border: '1px solid black', margin: '10px' }}
                >
                  <tbody>
                    <tr>
                      <ThStyles>Title</ThStyles>
                      <ThStyles>Description</ThStyles>
                      <ThStyles>Start</ThStyles>
                      <ThStyles>End</ThStyles>
                      <ThStyles>Upload</ThStyles>
                    </tr>

                    {course.courses.events.map(
                      ({ title, description, start, end, id, upload }) => (
                        <TrStyles key={id}>
                          <TdStyles>{title}</TdStyles>
                          <TdStyles>
                            {htmlToText.fromString(description)}
                          </TdStyles>
                          <TdStyles>
                            {moment(start).format('MMM Do YYYY')}
                          </TdStyles>
                          <TdStyles>
                            {moment(end).format('MMM Do YYYY')}
                          </TdStyles>
                          <TdStyles>
                            {upload && <a href={upload}>{title}-Upload</a>}
                          </TdStyles>
                          <TdStyles />
                        </TrStyles>
                      )
                    )}
                  </tbody>
                </TableStyles>
              </>
            ))
          }}
        </Query>
      </ScheduleStyles>
    )
  }
}

export default Schedule
