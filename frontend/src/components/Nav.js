import React from 'react'
import { Link } from 'react-router-dom'
import NavStyles from './styles/NavStyles'
import User from './User'
import Signout from './Signout'
import IsAdminTeacher from './IsAdminTeacher'
import SchedulePDF from './SchedulePDF'

const Nav = () => (
  <User>
    {({ data: { me } }) => (
      <NavStyles>
        <Link to="/select_classes">Select Classes</Link>
        {me && (
          <>
            <Link to="/schedule">See Schedule</Link>
            <Link to="/calendar">Calendar</Link>
            <IsAdminTeacher>
              <Link to="/create_course">Teacher's Create Course Here</Link>
            </IsAdminTeacher>
            <Signout />
          </>
        )}
        {!me && <Link to="/signin">Sign In</Link>}
      </NavStyles>
    )}
  </User>
)

export default Nav
