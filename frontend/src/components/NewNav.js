import React, { Component } from 'react'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Announcements from './Announcements'
import IsAdminTeacher from './IsAdminTeacher'
import Signout from './Signout'
import MenuIcon from './styles/menu.js'
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
        {({ data: { me } }) => (
          <NavStyles>
            {me && (
              <>
                <Dropdown drop="down" onToggle={this.toggle}>
                  <Dropdown.Toggle id="dropdown-basic">
                    {!this.state.isOpen ? <MenuIcon /> : <XIcon />}
                  </Dropdown.Toggle>

                  <Dropdown.Menu id="dropdown-items">
                    <Link to="/schedule">See Schedule</Link>

                    <IsAdminTeacher>
                      <Link to="/create_course">Create Course</Link>
                    </IsAdminTeacher>

                    <Signout />
                  </Dropdown.Menu>
                </Dropdown>

                <Announcements />
              </>
            )}
            {!me && (
              <Link to="/signin" className="signin">
                Sign In
              </Link>
            )}
          </NavStyles>
        )}
      </User>
    )
  }
}
export default NewNav
