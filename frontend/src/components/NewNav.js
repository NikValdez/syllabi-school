import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Announcements from './Announcements'
import IsAdminTeacher from './IsAdminTeacher'
import Signout from './Signout'
import MenuIcon from './styles/menu.js'
import NavStyles from './styles/NavStyles'
import User from './User'

const NewNav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles>
        {me && (
          <>
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                <MenuIcon />
              </Dropdown.Toggle>
              <Dropdown.Menu id="dropdown-items">
                <Link to="/schedule">See Schedule</Link>

                <IsAdminTeacher>
                  <Link to="/create_course">Create Course</Link>
                </IsAdminTeacher>

                <Signout />
              </Dropdown.Menu>
            </Dropdown>
            <button>
              <Announcements />
            </button>
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

export default NewNav
