import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import NavStyles from './styles/NavStyles'
import User from './User'

class Nav extends Component {
  render() {
    return (
      <>
        <NavStyles>
          <>
            <User>
              {({ data: { me } }) => {
                console.log(me)
                if (me) return <p>{me.name}</p>
                return null
              }}
            </User>
            <Link to="/select_classes">Select Classes</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/sign_in">Sign In</Link>
          </>
        </NavStyles>
      </>
    )
  }
}

export default Nav
