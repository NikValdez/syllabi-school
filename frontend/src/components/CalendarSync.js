/* global gapi */
import htmlToText from 'html-to-text'
import ical from 'ical-generator'
import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import Button from './styles/Button'

gapi.load('client:auth2', function() {
  gapi.auth2.init({
    client_id:
      '335751011458-j6070j2ugp7a915kv6t6u6s848s0bp12.apps.googleusercontent.com'
  })
})

export default class CalendarSync extends Component {
  state = {
    courseId: this.props.courseId,
    appleEvents: this.props.courseEvents,
    googleEvents: this.props.courseEvents,
    show: false,
    linkUrl: ''
  }

  handleClose = () => {
    this.setState({ show: false })
  }

  handleShow = () => {
    this.setState({ show: true })
  }

  createIcal = () => {
    this.state.appleEvents.map(course => {
      course.summary = course.title
      delete course.title
      course.description = htmlToText.fromString(course.description)
      course.background = course.color
      delete course.color

      this.setState({
        appleEvents: this.state.appleEvents
      })
    })
    const calendar = ical({
      domain: 'gosyllabi.com',
      prodId: '//Syllabi//ical-generator//EN',
      events: this.props.courseEvents
    }).toURL()

    let link = document.createElement('a')
    document.body.appendChild(link)
    link.download = `${this.props.courseTitle}- schedule`
    link.href = calendar
    return link.click()
  }

  createOulookCal = () => {
    this.state.appleEvents.map(course => {
      course.summary = course.title
      delete course.title
      course.description = htmlToText.fromString(course.description)
      course.background = course.color
      delete course.color

      this.setState({
        appleEvents: this.state.appleEvents
      })
    })
    const calendar = ical({
      domain: 'gosyllabi.com',
      prodId: '//Syllabi//ical-generator//EN',
      events: this.props.courseEvents
    })

    return window.open('data:text/calendar;charset=utf8,' + escape(calendar))
  }

  authenticate = () => {
    return gapi.auth2
      .getAuthInstance()
      .signIn({
        scope:
          'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
      })
      .then(
        function() {
          console.log('Sign-in successful')
        },
        function(err) {
          console.error('Error signing in', err)
        }
      )
      .then(this.loadClient)
  }

  loadClient = () => {
    return gapi.client
      .load('https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest')
      .then(
        function() {
          console.log('GAPI client loaded for API')
        },
        function(err) {
          console.error('Error loading GAPI client for API', err)
        }
      )
      .then(this.execute)
  }

  execute = () => {
    this.state.googleEvents.map(course => {
      course.summary = course.title
      delete course.title
      course.background = course.color
      delete course.color
      course.start = { dateTime: course.start }
      course.end = { dateTime: course.end }
      delete course.id
      this.setState({
        googleEvents: this.state.googleEvents
      })
    })
    this.state.googleEvents.map(event => {
      return gapi.client.calendar.events
        .insert({
          calendarId: 'primary',
          resource: event
        })
        .then(
          response => {
            this.setState({
              linkUrl: response.result.htmlLink,
              show: true
            })
          },
          err => {
            console.error('Execute error', err)
          }
        )
    })
  }

  addScheduleToCalendar = () => {
    window.open(this.state.linkUrl)
  }

  render() {
    return (
      <div>
        <h4>Sync:</h4>
        <h4
          onClick={this.createIcal}
          style={{
            display: 'inline-block',
            cursor: 'pointer',
            marginBottom: '25px'
          }}
        >
          <i className="far fa-calendar-alt" /> Apple
        </h4>
        <h4
          onClick={this.authenticate}
          style={{
            display: 'inline-block',
            marginLeft: '10px',
            marginBottom: '15px',
            cursor: 'pointer'
          }}
        >
          <i className="far fa-calendar-alt" /> Google
        </h4>
        {/* <h4
          onClick={this.createOulookCal}
          style={{
            display: 'inline-block',
            cursor: 'pointer',
            marginLeft: '10px'
          }}
        >
          <i className="far fa-calendar-alt" /> Outlook
        </h4> */}

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          style={{
            height: '30%',
            width: '40%',
            top: '50%',
            left: ' 50%',
            overflow: 'hidden',
            minHeight: 0
          }}
        >
          <Modal.Header
            closeButton
            style={{
              width: '38%'
            }}
          >
            <h2>Add Schedule to Google Calendar</h2>
          </Modal.Header>
          <Modal.Body>
            <Button
              onClick={() => {
                this.addScheduleToCalendar()
                this.handleClose()
              }}
            >
              Add to <i className="fab fa-google" />
              oogle
            </Button>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}
