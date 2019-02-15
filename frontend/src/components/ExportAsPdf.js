import gql from 'graphql-tag'
import htmlToText from 'html-to-text'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import _ from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { Col, Modal, Row, Table } from 'react-bootstrap'
import styled from 'styled-components'
import Button from './styles/Button'
import './styles/Modal.css'

const SingleCourseStyles = styled.div`
  max-width: 1200px;
  /* margin: 2rem auto; */

  display: grid;
  .modal-content {
    width: 180% !important;
  }

  a {
    color: black;
  }
  .update-delete {
    text-align: right;
    a {
      margin-right: 2rem;
      background: black;
      color: white;
      font-weight: 500;
      border: 0;
      border-radius: 0;
      text-transform: uppercase;
      font-size: 1rem;
      padding: 0.5rem 1.2rem;
      display: inline-block;
      text-decoration: none;
    }
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    text-align: center;
    margin-top: -20rem;
  }
`
const CreateEventStyles = styled.div`
  grid-template-columns: start;
`

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
    show: false
  }

  generate = () => {
    const pdf = new jsPDF('p', 'pt', 'a4')
    pdf.setFontSize(12)
    pdf.setTextColor('black')
    // pdf.text(20, 20, 'This is a title')
    const input = document.getElementById('divToDownload')
    html2canvas(input, { scale: '2' }).then(canvas => {
      const imgData = canvas.toDataURL('image/png')

      pdf.addImage(imgData, 'PNG', 15, 0, 200, 114)
    })
    pdf.setTextColor('black')
    pdf.setFillColor(0)
    pdf.addFont('times', 'normal')
    pdf.setFont('times')
    pdf.setFontSize(18)
    pdf.text(500, 30, this.props.institutionName)
    pdf.text(500, 50, 'Syllabus')

    pdf.fromHTML(
      document.getElementById('html-2-pdfwrapper'),
      margins.left, // x coord
      margins.top,
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
    this.setState({ show: false })
  }

  handleShow = () => {
    this.setState({ show: true })
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
            <SingleCourseStyles>
              <h4 variant="primary" onClick={this.handleShow}>
                <span style={{ marginRight: '10px' }}>
                  <i className="fas fa-book-open" />
                </span>
                View Syllabus
              </h4>
              <Modal
                className="custom-map-modal"
                show={this.state.show}
                onHide={this.handleClose}
                bsPrefix="my-modal"
              >
                <Modal.Header closeButton style={{ borderBottom: 'none' }} />
                <Button
                  onClick={() => {
                    this.generate()
                    this.handleClose()
                  }}
                  style={{ width: '10%', marginTop: '2rem' }}
                >
                  Export PDF
                </Button>

                <div id="html-2-pdfwrapper" style={{ zIndex: '999' }}>
                  <span
                    id="divToDownload"
                    style={{
                      position: 'absolute',
                      top: '5px'
                    }}
                  >
                    <img
                      src={this.props.institutionLogo}
                      style={{ width: '50px' }}
                      alt="logo"
                    />
                  </span>

                  <Row>
                    <Col md={6} xs={6}>
                      <Table bordered responsive>
                        <tbody>
                          <tr>
                            <th>Title</th>
                            <td>{course.title}</td>
                          </tr>
                          <tr>
                            <th>Course Code</th>
                            <td>{course.courseCode}</td>
                          </tr>
                          <tr>
                            <th>Credits</th>
                            <td>{course.credits}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  <div>
                    <h3>Course Description</h3>
                    <p>{htmlToText.fromString(course.description)}</p>
                  </div>
                  <h2 style={{ float: 'left' }}>Course Calendar</h2>
                  {course.events.length < 1 ? (
                    <p>No Assignments Currently</p>
                  ) : (
                    <Table bordered>
                      <thead>
                        <tr>
                          <td>Date</td>
                          <td>Title</td>
                          <td>Description</td>
                          <td>Upload</td>
                        </tr>
                      </thead>

                      {course.events.map(
                        ({ title, description, start, end, id, upload }) => (
                          <tbody key={id}>
                            <tr>
                              <td>{moment(end).format('MMM Do YYYY')}</td>
                              <td>{title}</td>
                              <td>{htmlToText.fromString(description)}</td>

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
                  )}
                </div>
                <Button
                  onClick={this.handleClose}
                  style={{
                    marginTop: '4rem',

                    width: '50%'
                  }}
                >
                  Close
                </Button>
              </Modal>
            </SingleCourseStyles>
          )
        }}
      </Query>
    )
  }
}

export default ExportAsPdf
