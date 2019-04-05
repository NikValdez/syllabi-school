import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import StyledFooter from './styles/FooterStyles'

const today = new Date()

export class Footer extends React.Component {
  render() {
    return (
      <StyledFooter>
        <Row>
          <Col sm={6} className="col-12 hidden-sm-down">
            <Link to="/terms_and_conditions">Terms &amp; Conditions</Link>
            <Link to="/privacy_policy">Privacy Policy</Link>
          </Col>
          <Col sm={6} className="col-12 text-sm-right">
            <p>&copy; Syllabi {today.getFullYear()}</p>
          </Col>
        </Row>
      </StyledFooter>
    )
  }
}

export default Footer
