import React from 'react'
import { Link } from 'react-router-dom'

const today = new Date()

export class Footer extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Link to="/terms_and_conditions">Terms &amp; Conditions</Link>
          <Link to="/privacy_policy">Privacy Policy</Link>
        </div>
        <div>
          <p>&copy; Syllabi {today.getFullYear()}</p>
        </div>
      </div>
    )
  }
}

export default Footer
