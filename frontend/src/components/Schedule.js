import moment from 'moment'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import ReactHtmlParser from 'react-html-parser'
import FilePlaceholder from '../images/filePlaceholder.png'
import { CURRENT_USER_QUERY_COURSES_EVENTS } from './MyCourses'

export class Schedule extends Component {
  render() {
    return (
      <Query query={CURRENT_USER_QUERY_COURSES_EVENTS}>
        {({ data, error, loading }) => {
          if (loading) return <p>Loading...</p>
          if (error) return <p>Error : {error.message}</p>
          const courseData = data.me.myCourses.map(
            course => course.courses.events
          )

          const courseColor = data.me.myCourses.map(course => {
            return (
              <div key={course.courses.id}>
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
            <section className="container py-m">
              <h1 className="title is-spaced">Full Schedule</h1>

              <div className="colors pb-m">{color}</div>

              <table className="table is-bordered is-fullwidth is-hoverable">
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
                      <td style={{ background: course.color }}>
                        {moment(course.end).format('MMM Do YYYY')}
                      </td>
                      <td>{course.title}</td>
                      <td>{ReactHtmlParser(course.description)}</td>
                      <td>
                        {course.upload && (
                          <a href={course.upload} target="blank">
                            <div>
                              <img src={FilePlaceholder} alt="File download" />
                              <span>{course.upload.split('.').pop()}</span>
                            </div>
                          </a>
                        )}
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </section>
          )
        }}
      </Query>
    )
  }
}

export default Schedule
