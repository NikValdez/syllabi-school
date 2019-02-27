/* global gapi */

import ical from 'ical-generator'
import React, { Component } from 'react'

gapi.load('client:auth2', function() {
  gapi.auth2.init({
    client_id:
      '335751011458-n583bhqefi1g3bf4rkse8864em5jqr4t.apps.googleusercontent.com'
  })
})

export default class CalendarSync extends Component {
  state = {
    courseId: this.props.courseId,
    appleEvents: this.props.courseEvents,
    googleEvents: this.props.courseEvents
  }

  createIcal = () => {
    this.state.appleEvents.map(course => {
      course.summary = course.title
      delete course.title
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
      course.id = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(10, 20)
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
          function(response) {
            // Handle the results here (response.result has the parsed body).
            let urlLink = document.createElement('a')
            document.body.appendChild(urlLink)

            urlLink.href = response.result.htmlLink
            return urlLink.click()
          },
          function(err) {
            console.error('Execute error', err)
          }
        )
    })
  }

  render() {
    console.log(this.props.courseEvents)
    return (
      <div>
        <h4>Sync:</h4>
        <h4
          onClick={this.createIcal}
          style={{ display: 'inline-block', cursor: 'pointer' }}
        >
          <i className="far fa-calendar-alt" /> Apple
        </h4>
        <h4
          onClick={this.authenticate}
          style={{
            display: 'inline-block',
            marginLeft: '10px',
            cursor: 'pointer'
          }}
        >
          <i className="far fa-calendar-alt" /> Google
        </h4>
      </div>
    )
  }
}
