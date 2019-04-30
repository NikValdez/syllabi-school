import React, { Component } from 'react'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Announcements from './Announcements'
import IsAdmin from './IsAdmin'
import IsAdminTeacher from './IsAdminTeacher'
import Signout from './Signout'
import MenuIcon from './styles/menu'
import NavStyles from './styles/NavStyles'
import XIcon from './styles/XIcon'
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
            <NavStyles>
              <>
                <Dropdown onToggle={this.toggle}>
                  <Dropdown.Toggle id="dropdown-basic">
                    {!this.state.isOpen ? <MenuIcon /> : <XIcon />}

                    <Dropdown.Menu id="dropdown-items">
                      <Link to="/schedule">Full Schedule</Link>

                      <IsAdminTeacher>
                        <Link to="/create_course">Create Department</Link>
                      </IsAdminTeacher>
                      <IsAdmin>
                        <Link to="/permissions">Permissions</Link>
                        <Link to="/create_institution">Create Show</Link>
                      </IsAdmin>

                      <a>
                        <Signout />
                      </a>
                    </Dropdown.Menu>
                  </Dropdown.Toggle>
                </Dropdown>

                <Announcements />
              </>

              {!me && (
                <Link to="/signin" className="signin">
                  Sign In
                </Link>
              )}
            </NavStyles>
          )
        }}
      </User>
    )
  }
}
export default NewNav
