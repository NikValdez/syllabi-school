import React, { Component } from 'react'
import CoursePDF from './CoursePDF'

class SingleCourse extends Component {
  state = {
    id: this.props.match.params.id
  }
  render() {
    return (
      <div className="details">
        <CoursePDF id={this.state.id} />
      </div>
    )
  }
}

export default SingleCourse
