import React, { Component } from 'react'
// import events from '../lib/events'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import { Query } from 'react-apollo'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { CURRENT_USER_QUERY_COURSES_EVENTS } from './MyCourses'

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
              <BigCalendar
                style={{ height: 500 }}
                localizer={localizer}
                events={calEvents}
                startAccessor="start"
                endAccessor="end"
              />
            )
          }}
        </Query>
      </>
    )
  }
}

export default Calendar
