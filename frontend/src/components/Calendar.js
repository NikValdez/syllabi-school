import moment from 'moment'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import BigCalendar from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Modal } from 'react-bootstrap'
import ReactHtmlParser from 'react-html-parser'
import { CURRENT_USER_QUERY_COURSES_EVENTS } from './MyCourses'
import BigCalStyles from './styles/BigCalStyles'

const localizer = BigCalendar.momentLocalizer(moment)

class Calendar extends Component {
  state = {
    show: false,
    title: '',
    description: '',
    start: '',
    end: ''
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
      end: event.end
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
            console.log(calEvents)
            return (
              <BigCalStyles>
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
              </BigCalStyles>
            )
          }}
        </Query>

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          style={{
            height: '40%',
            width: '40%',
            top: '50%',
            left: ' 50%',
            overflow: 'hidden'
          }}
        >
          <Modal.Header
            closeButton
            style={{
              width: '38%'
            }}
          >
            <Modal.Title>{this.state.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {ReactHtmlParser(this.state.description)}

            <h5>
              {moment(this.state.start).format('MMM Do YYYY')} -{' '}
              {moment(this.state.end).format('MMM Do YYYY')}
            </h5>
          </Modal.Body>
        </Modal>
      </>
    )
  }
}

export default Calendar
