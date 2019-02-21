import ical from 'ical-generator'
import React, { Component } from 'react'

export default class TestTable extends Component {
  state = {
    courseId: this.props.courseId,
    events: []
  }
  componentDidMount() {
    this.props.courseEvents.map(course => {
      course.summary = course.title
      delete course.title
      course.background = course.color
      delete course.color
    })
    this.setState({
      events: this.props.courseEvents
    })
  }

  createIcal = () => {
    const calendar = ical({
      domain: 'gosyllabi.com',
      prodId: '//Syllabi//ical-generator//EN',
      events: this.state.events
    }).toURL()
    // const newCal = calendar.replace('blob:', '')

    let link = document.createElement('a')
    document.body.appendChild(link)
    link.href = calendar
    return link.click()
  }

  render() {
    return (
      <div>
        <h4>Sync:</h4>
        <h4 onClick={this.createIcal}>
          <i className="far fa-calendar-alt" /> Apple
        </h4>
      </div>
    )
  }
}
