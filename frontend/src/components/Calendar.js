import React, { Component } from 'react'
import events from '../lib/events'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import { Query } from 'react-apollo'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { CURRENT_USER_QUERY_COURSES_EVENTS } from './MyCourses'
import styled from 'styled-components'

const BigCalStyles = styled.div`
  min-height: 500px;
  max-width: 1200px;
  margin: 2rem auto;
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  .rbc-calendar {
    box-shadow: 0 12px 24px 0 rgba(162, 124, 9, 0.25);
  }

  .rbc-event {
    background: #f9c321ab;
    color: black;
  }
  .rbc-today {
    background: #f9c32136;
  }
  .rbc-toolbar-label {
    font-size: 1.5rem;
    font-weight: 700;
  }
  .rbc-btn-group {
    button:hover {
      background: #f9c32136;
    }
  }
`

const localizer = BigCalendar.momentLocalizer(moment)

const allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

class Calendar extends Component {
  render() {
    return (
      <>
        <Query query={CURRENT_USER_QUERY_COURSES_EVENTS}>
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>
            if (error) return <p>Error : {error.message}</p>
            const courseData = data.me.myCourses.map(course => course.courses)
            const eventData = courseData.map(course => course.events)
            const calEvents = [].concat.apply([], eventData)

            return (
              <BigCalStyles>
                <BigCalendar
                  popup
                  localizer={localizer}
                  events={calEvents}
                  startAccessor="start"
                  endAccessor="end"
                />
              </BigCalStyles>
            )
          }}
        </Query>
      </>
    )
  }
}

export default Calendar
