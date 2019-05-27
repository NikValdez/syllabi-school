import React, { Component } from 'react'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Announcements from './Announcements'
import IsAdmin from './IsAdmin'
import IsAdminTeacher from './IsAdminTeacher'
import Signout from './Signout'

import User from './User'

class NewNav extends Component {
  state = {
    isOpen: false
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    return (
      <User>
        {({ data }) => {
          const me = data ? data.me : null
          return (
            <div id="navbarMenu" className="navbar-menu">
              <>
                <div className="announcement">

                </div>
                <div className="navbar-start">
                  <Link className="navbar-item" to="/schedule">Full Schedule</Link>
                  <IsAdminTeacher>
                    <Link className="navbar-item" to="/create_course">Create Department</Link>
                  </IsAdminTeacher>
                  <IsAdmin>
                    <Link className="navbar-item" to="/permissions">Permissions</Link>
                    <Link className="navbar-item" to="/create_institution">Create Show</Link>
                  </IsAdmin>
                </div>

                <div className="navbar-end">
                  <div className="navbar-item">
                    <div className="buttons">
                      <Announcements />
                      <a className="button">
                        <Signout />
                      </a>
                    </div>
                  </div>
                </div>
              </>

              {!me && (
                <Link to="/signin" className="signin">
                  Sign In
                </Link>
              )}
            </div>
          )
        }}
      </User>
    )
  }
}
export default NewNav
