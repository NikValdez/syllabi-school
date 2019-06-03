/* global gapi */
import htmlToText from 'html-to-text'
import ical from 'ical-generator'
import React, { Component } from 'react'
// import { Modal } from 'react-bootstrap'

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
    showModal: false,
    linkUrl: ''
  }

  handleOpen = () => {
    this.setState({ showModal: true })
  }

  handleClose = () => {
    this.setState({ showModal: false })
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
      return this.state.appleEvents
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

  // createOulookCal = () => {
  //   this.state.appleEvents.map(course => {
  //     course.summary = course.title
  //     delete course.title
  //     course.description = htmlToText.fromString(course.description)
  //     course.background = course.color
  //     delete course.color

  //     this.setState({
  //       appleEvents: this.state.appleEvents
  //     })
  //   })
  //   const calendar = ical({
  //     domain: 'gosyllabi.com',
  //     prodId: '//Syllabi//ical-generator//EN',
  //     events: this.props.courseEvents
  //   })

  //   return window.open('data:text/calendar;charset=utf8,' + escape(calendar))
  // }

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
      return this.state.googleEvents
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
              showModal: true
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
      <>
        <button className="button is-small" onClick={this.createIcal}>
          Apple Sync
        </button>
        <button className="button is-small" onClick={this.authenticate}>
          Google Sync
        </button>

        <div className={!this.state.showModal ? 'modal' : 'modal is-active'}>
          <div className="modal-background" onClick={this.handleClose} />
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">
                Add Schedule to Google Calendar
              </p>
              <button
                className="delete"
                aria-label="close"
                onClick={this.handleClose}
              />
            </header>
            <section className="modal-card-body">
              <button
                onClick={() => {
                  this.addScheduleToCalendar()
                  this.handleClose()
                }}
              >
                Add to <i className="fab fa-google" />
                oogle
              </button>
            </section>
          </div>
        </div>
      </>
    )
  }
}
