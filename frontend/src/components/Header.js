import React from 'react'
import { Query } from 'react-apollo'
import { Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Institution from './Institution'
import HeaderNav from './Nav'
import StyledHeader from './styles/HeaderStyles'
import { CURRENT_USER_QUERY } from './User'

const Header = () => (
  <StyledHeader>
    <Query query={CURRENT_USER_QUERY}>
      {({ data, error, loading }) => {
        if (error) return <p>Error : {error.message}</p>
        if (loading) return <p>Loading</p>

        return (
          <>
            <div className="bar">
              <Nav className="d-flex justify-content-between">
                <Nav.Item>
                  <Link to="/" className="logo">
                    Syllabi
                  </Link>
                </Nav.Item>

                <HeaderNav />
              </Nav>
            </div>
            <div className="bar-2">
              <Nav className="d-flex justify-content-between">
                <div>
                  <p style={{ fontWeight: '700' }}>{data.me.name}</p>
                  <p>{data.me.email}</p>
                </div>
                <Nav.Item />
                <Nav.Item className="d-flex justify-content-start">
                  <Institution />
                </Nav.Item>
              </Nav>
            </div>
          </>
        )
      }}
    </Query>
  </StyledHeader>
)

export default Header
