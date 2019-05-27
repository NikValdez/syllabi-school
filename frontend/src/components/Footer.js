import React from 'react'
import { Link } from 'react-router-dom'

const today = new Date()

export class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <div className="content has-text-centered">
          <div className="navbar-menu">
            <Link className="navbar-item" to="/terms_and_conditions">Terms &amp; Conditions</Link>
            <Link className="navbar-item" to="/privacy_policy">Privacy Policy</Link>
          </div>
          <p>Powered by &copy; Syllabi {today.getFullYear()}</p>
        </div>
      </footer>
    )
  }
}

export default Footer
