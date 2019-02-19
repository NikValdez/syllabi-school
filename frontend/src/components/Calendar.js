import htmlToText from 'html-to-text'
import moment from 'moment'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import BigCalendar from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Modal } from 'react-bootstrap'
import styled from 'styled-components'
import { CURRENT_USER_QUERY_COURSES_EVENTS } from './MyCourses'
import Empty from './styles/empty.png'
import './styles/fonts/NeuzeitOffice-Regular.svg'
import left from './styles/left.svg'
import right from './styles/right.svg'

const BigCalStyles = styled.div`
  margin-right: 20px;
  height: 85vh;
  width: 65vw;
  margin: 2rem auto;
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  .rbc-calendar {
    .rbc-month-header {
      border-color: #f5f5f5;
      background: #f5f5f5;
      padding: 5px;
      border-bottom: 1px solid #ddd;
      font-family: 'Neuzeit Office';
    }
    .rbc-off-range-bg {
      background: #e5e5e526;
    }
    .rbc-header {
      border: none;
      font-family: 'Neuzeit Office';
      font-weight: 200;
    }
    .rbc-date-cell {
      font-size: 12px;
      text-align: left;
      padding: 2px 5px;
    }
  }
  .rbc-show-more {
    color: #f9c321ab;
  }

  .rbc-event {
    color: black;
    border-radius: 0;
    font-size: 12px;
    padding: 5px;
  }
  .rbc-today {
    background: url(${Empty});
  }
  .rbc-toolbar-label {
    font-size: 17px;
  }
  .rbc-toolbar {
    background: transparent;
  }
  .rbc-btn-group {
    button:nth-child(3) {
      //next
      color: white;
      border: none;
      position: absolute;
      right: 5px;
      &:before {
        content: url(${right});
        width: 50%;
      }
    }
    button:nth-child(2) {
      //back
      color: white;
      border: none;
      &:before {
        content: url(${left});
      }
    }
    button:first-child:not(:last-child) {
      display: none;
    }

    button:hover {
      background: white;
      color: white;
      border: none;
    }
    button:active {
      background: white;
      color: white;
      border: none;
      outline: none;
      box-shadow: none;
    }
    button:focus {
      background: white;
      color: white;
      border: none;
      outline: none;
      box-shadow: none;
    }
  }
`

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
            <p> {htmlToText.fromString(this.state.description)}</p>

            <h5>
              {moment(this.state.start).format('MMM Do YY')} -{' '}
              {moment(this.state.end).format('MMM Do YY')}
            </h5>
          </Modal.Body>
        </Modal>
      </>
    )
  }
}

export default Calendar
