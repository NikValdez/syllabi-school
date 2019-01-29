import React from 'react'
import { Link } from 'react-router-dom'
import Announcements from './Announcements'
import IsAdminTeacher from './IsAdminTeacher'
import Signout from './Signout'
import NavStyles from './styles/NavStyles'
import User from './User'

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
