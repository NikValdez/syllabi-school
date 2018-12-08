import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Item extends Component {
  render() {
    const { item } = this.props
    return (
      <div>
        <Link to="/item/:id">
          <h3>{item.title}</h3>
        </Link>
        <h6>{item.price}</h6>
        <p>{item.description}</p>
      </div>
    )
  }
}

export default Item
