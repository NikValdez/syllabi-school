import gql from 'graphql-tag'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import moment from 'moment'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { Col, Modal, Row, Table } from 'react-bootstrap'
import ReactHtmlParser from 'react-html-parser'
import FilePlaceholder from '../images/filePlaceholder.png'
import CalendarSync from './CalendarSync'

const SINGLE_COURSE_QUERY = gql`
  query SINGLE_COURSE_QUERY($id: ID!) {
    course(where: { id: $id }) {
      id
      title
      description
      courseCode
      credits
      color
      events {
        id
        title
        description
        start
        end
        upload
        color
      }
      announcements {
        id
        text
        date
      }
    }
  }
`

const margins = {
  top: 70,
  bottom: 40,
  left: 30,
  width: 550
}

class ExportAsPdf extends Component {
  state = {
    id: this.props.id,
    showModal: false
  }

  generate = () => {
    const pdf = new jsPDF('p', 'pt', 'a4')

    pdf.setFontSize(12)
    pdf.setTextColor('black')
    // pdf.text(20, 20, 'This is a title')
    pdf.setTextColor('black')

    pdf.setFont('times')
    pdf.setFontSize(18)
    pdf.text(20, 30, this.props.institutionName)
    pdf.text(20, 50, 'Syllabus')

    pdf.autoTable({
      styles: { fillColor: '#fff' },
      theme: 'grid',
      bodyStyles: { lineColor: [0, 0, 0] },
      margin: { top: 100 },
      html: '#course-table',
      showHead: 'firstPage',
      tableWidth: 300
    })
    pdf.setFontSize(13)
    pdf.text(40, 300, 'Calendar')
    pdf.autoTable({
      styles: { fillColor: '#fff' },
      theme: 'grid',
      bodyStyles: { lineColor: [0, 0, 0] },
      startY: 320,
      html: '#course-calendar',
      showHead: 'firstPage',
      lineColor: 'black',
      lineWidth: 4
    })

    pdf.fromHTML(
      document.getElementById('course-description'),
      40, // x coord
      175,
      {
        width: margins.width
      }
    )

    pdf.fromHTML(
      document.getElementById('html-2-pdfwrapper'),
      500,
      10,
      {
        // y coord
        width: margins.width // max width of content on PDF
      },
      function() {
        pdf.save('Syllabus.pdf')
      },
      margins
    )
  }

  handleClose = () => {
    this.setState({ showModal: false })
  }

  handleShow = () => {
    this.setState({ showModal: true })
  }

  render() {
    return (
      <Query
        query={SINGLE_COURSE_QUERY}
        variables={{
          id: this.state.id
        }}
      >
        {({ error, loading, data }) => {
          if (error) return <p>Error</p>
          if (loading) return <p />
          if (!data.course) return <p>No Course Found for {this.state.id}</p>
          const course = data.course

          return (
            <div className="buttons">
              <button
                className="button is-small is-black"
                onClick={this.handleShow}
                style={{ cursor: 'pointer' }}
              >
                View Schedule
              </button>
              <CalendarSync
                courseTitle={course.title}
                courseEvents={course.events}
              />

              <div
                className={!this.state.showModal ? 'modal' : 'modal is-active'}
              >
                <div className="modal-background" onClick={this.handleClose} />
                <div className="modal-card">
                  <header className="modal-card-head">
                    <span className="modal-card-title">
                      {' '}
                      <img
                        className="image is-32x32"
                        src={this.props.institutionLogo}
                        alt="logo"
                      />
                    </span>
                    <button
                      className="delete"
                      aria-label="close"
                      onClick={this.handleClose}
                    />
                  </header>
                  <section className="modal-card-body">
                    <table id="course-table">
                      <tbody>
                        <tr>
                          <th>Title</th>
                          <td>{course.title}</td>
                        </tr>
                        <tr>
                          <th>Owner(s)</th>
                          <td>{course.courseCode}</td>
                        </tr>
                        <tr>
                          <th>Extension</th>
                          <td>{course.credits}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div id="course-description" className="py-m">
                      <h3>Additional Information</h3>
                      {ReactHtmlParser(course.description)}
                    </div>

                    <div id="html-2-pdfwrapper">
                      <button
                        className="button"
                        onClick={() => {
                          this.generate()
                          this.handleClose()
                        }}
                      >
                        Export PDF
                      </button>
                    </div>

                    <h2 className="mt-m">Department Schedule</h2>
                    {course.events.length < 1 ? (
                      <p>No Events Currently</p>
                    ) : (
                      <table id="course-calendar">
                        <tbody>
                          <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Upload</th>
                          </tr>
                        </tbody>

                        {course.events.map(
                          ({ title, description, start, end, id, upload }) => (
                            <tbody key={id}>
                              <tr>
                                <td>{moment(end).format('MMM Do YYYY')}</td>
                                <td>{title}</td>
                                <td>{ReactHtmlParser(description)}</td>
                                <td>
                                  {upload && (
                                    <a href={upload} target="blank">
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
                                        <span>{upload.split('.').pop()}</span>
                                      </div>
                                    </a>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          )
                        )}
                      </table>
                    )}
                  </section>
                </div>
              </div>
            </div>
          )
        }}
      </Query>
    )
  }
}

export default ExportAsPdf
export { SINGLE_COURSE_QUERY }
