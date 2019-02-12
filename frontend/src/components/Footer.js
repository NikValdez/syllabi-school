import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledFooter = styled.footer`
  background: black;
  color: white;
  /* position: fixed; */
  bottom: 0px;
  width: 101vw;

  a {
    color: white;
    margin-right: 20px;
    margin-left: 20px;
    padding-top: 10px;
    &:hover {
      color: #fffcdf;
      text-decoration: none;
    }
  }
  p {
    padding-right: 20px;
    padding-top: 10px;
  }
  .row {
    margin: 0;
  }
  .hidden-sm-down {
    padding-top: 10px;
  }
`

const today = new Date()

export class Footer extends React.Component {
  render() {
    return (
      <StyledFooter>
        <Row>
          <Col sm={6} className="col-12 hidden-sm-down">
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
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
