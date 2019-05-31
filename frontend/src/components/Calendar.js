import moment from 'moment'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import BigCalendar from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import ReactHtmlParser from 'react-html-parser'
import { CURRENT_USER_QUERY_COURSES_EVENTS } from './MyCourses'

const localizer = BigCalendar.momentLocalizer(moment)

class Calendar extends Component {
  state = {
    showModal: false,
    title: '',
    description: '',
    start: '',
    end: '',
    upload: ''
  }

  handleClose = () => {
    this.setState({ showModal: false })
  }

  handleShow = () => {
    this.setState({ showModal: true })
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

        <div className={!this.state.showModal ? 'modal' : 'modal is-active'}>
          <div className="modal-background" onClick={this.handleClose} />
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">{this.state.title}</p>
              <button
                className="delete"
                aria-label="close"
                onClick={this.handleClose}
              />
            </header>
            <section className="modal-card-body">
              <h3 className="subtitle mt-s is-spaced">Description:</h3>
              {ReactHtmlParser(this.state.description)}

              <h3 className="subtitle mt-m is-spaced">Upload:</h3>

              <a href={this.state.upload} target="blank">
                {this.state.upload && (
                  <p>
                    {this.state.title} <i className="fas fa-link" />{' '}
                  </p>
                )}
              </a>

              <h3 className="subtitle mt-m is-spaced">Dates:</h3>
              <p>
                {moment(this.state.start).format('MMM Do YYYY')} -{' '}
                {moment(this.state.end).format('MMM Do YYYY')}
              </p>
            </section>
          </div>
        </div>
      </>
    )
  }
}

export default Calendar
