import React from 'react'
import { Link } from 'react-router-dom'
import NavStyles from './styles/NavStyles'
import User from './User'
import Signout from './Signout'
import IsAdminTeacher from './IsAdminTeacher'
import Announcements from './Announcements'

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles>
        {me && (
          <>
            <Link to="/schedule">See Schedule</Link>
            <IsAdminTeacher>
              <Link to="/create_course">Create Course</Link>
            </IsAdminTeacher>
            <Signout />
            <button>
              <Announcements />
            </button>
          </>
        )}
        {!me && <Link to="/signin">Sign In</Link>}
      </NavStyles>
    )}
  </User>
)

export default Nav
