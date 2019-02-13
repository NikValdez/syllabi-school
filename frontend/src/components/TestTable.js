import React from 'react'
import AddToCalendar from 'react-add-to-calendar'

export default class TestTable extends React.Component {
  render() {
    const events = {
      title: 'Sample Event',
      description: 'This is the sample event provided as an example only',
      startTime: '2019-02-16T20:15:00-04:00',
      endTime: '2019-02-16T21:45:00-04:00'
    }

    return <AddToCalendar event={events} />
  }
}
