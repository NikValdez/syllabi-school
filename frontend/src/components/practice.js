import _ from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { Table } from 'react-bootstrap'
import ReactHtmlParser from 'react-html-parser'
import styled from 'styled-components'
import Book from '../book.gif'
import { CURRENT_USER_QUERY_COURSES_EVENTS } from './MyCourses'

const ScheduleStyles = styled.div`
  margin: 20px;
  h3 {
    margin-top: 30px;
  }
  .gradient_line {
    margin: 0 0 50px 0;
    margin-top: 50px;
    display: block;
    border: none;
    height: 1px;
    background: #6d6c6c;
    background: linear-gradient(
      to right,
      white,
      #c7c3c3,
      #353434,
      #c7c3c3,
      white
    );
  }
`

export class Test extends Component {
  render() {
    return (
      <Query query={CURRENT_USER_QUERY_COURSES_EVENTS}>
        {({ data, error, loading }) => {
          if (loading) return <img src={Book} alt="Loading" />
          if (error) return <p>Error : {error.message}</p>
          const courseData = data.me.myCourses.map(course => course)
          const newArr = courseData.map(course => course.courses)
          const newNew = newArr.map(value => value.events)

          console.log(newNew)
          return courseData.map(course => (
            <ScheduleStyles key={course.courses.id}>
              {course.courses.events.length < 1 ? (
                <>
                  <p>No Schedule Listed</p>
                  <hr className="gradient_line" />
                </>
              ) : (
                <>
                  <h3>Course Schedule</h3>
                  <Table bordered>
                    <thead>
                      <tr>
                        <td>Date</td>
                        <td>Title</td>
                        <td>Description</td>
                        {/* <td>Start</td> */}
                        <td>Upload</td>
                      </tr>
                    </thead>

                    {course.courses.events.map(
                      ({ title, description, start, end, id, upload }) => (
                        <tbody key={id}>
                          <tr>
                            <td>{moment(end).format('MMM Do YYYY')}</td>
                            <td>{title}</td>
                            <td>{ReactHtmlParser(description)}</td>
                            {/* <td>{moment(start).format('MMM Do YYYY')}</td> */}
                            <td>
                              {upload && (
                                <a href={upload}>
                                  {_.truncate(title, {
                                    length: 24
                                  })}
                                </a>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      )
                    )}
                  </Table>
                  <hr className="gradient_line" />
                </>
              )}
            </ScheduleStyles>
          ))
        }}
      </Query>
    )
  }
}

export default Test
