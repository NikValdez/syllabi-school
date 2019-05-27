import moment from 'moment'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import BigCalendar from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Modal } from 'react-bootstrap'
import ReactHtmlParser from 'react-html-parser'
import { CURRENT_USER_QUERY_COURSES_EVENTS } from './MyCourses'

const localizer = BigCalendar.momentLocalizer(moment)

class Calendar extends Component {
  state = {
    show: false,
    title: '',
    description: '',
    start: '',
    end: '',
    upload: ''
  }

  handleClose = () => {
    this.setState({ show: false })
  }

  handleShow = () => {
    this.setState({ show: true })
  }
  details = event => {
    this.setState({
      title: event.title,
      description: event.description,
      start: event.start,
      end: event.end,
      upload: event.upload
    })
  }
  render() {
    return (
      <>
        <Query query={CURRENT_USER_QUERY_COURSES_EVENTS}>
          {({ data, error, loading }) => {
            if (loading) return <p />
            if (error) return <p>Error : {error.message}</p>
            const courseData = data.me.myCourses.map(course => course.courses)
            const eventData = courseData.map(course => course.events)
            const calEvents = [].concat.apply([], eventData)

            return (
              <div className="calendar">
                <BigCalendar
                  popup
                  onSelectEvent={event => {
                    this.handleShow()
                    this.details(event)
                  }}
                  views={['month']}
                  localizer={localizer}
                  events={calEvents}
                  startAccessor="start"
                  endAccessor="end"
                  eventPropGetter={events => ({
                    style: {
                      backgroundColor: events.color
                    }
                  })}
                />
              </div>
            )
          }}
        </Query>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3 className="subtitle mt-s is-spaced">Description:</h3>
            {ReactHtmlParser(this.state.description)}

            <h3 className="subtitle mt-m is-spaced">Upload:</h3>
            <p>
              <a href={this.state.upload} target="blank">
                {this.state.upload && this.state.title}{' '}
              </a>
              {this.state.upload && <i className="fas fa-link" />}
            </p>

            <h3 className="subtitle mt-m is-spaced">Dates:</h3>
            <p>
              {moment(this.state.start).format('MMM Do YYYY')} -{' '}
              {moment(this.state.end).format('MMM Do YYYY')}
            </p>
          </Modal.Body>
        </Modal>
      </>
    )
  }
}

export default Calendar
