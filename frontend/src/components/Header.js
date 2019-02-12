import React from 'react'
import { Query } from 'react-apollo'
import { Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Institution from './Institution'
import NewNav from './NewNav'
import { CURRENT_USER_QUERY } from './User'
const StyledHeader = styled.header`
  width: 100%;
  white-space: wrap;
  .bar {
    background: black;
    padding: 0 30px;
    height: 40px;
    width: 101vw;
  }
  .bar-2 {
    background: #fffcdf;
    padding: 0 30px;
    height: 70px;
    width: 101vw;
    p {
      padding: 20px 30px;
    }
  }
  .logo {
    color: white;
    text-decoration: none;
    font-weight: 700;
    font-size: 18px;

    &:hover {
      color: #fffcdf;
    }
  }
  .d-flex justify-content-between {
    height: 40px;
  }

  .nav-item {
    padding-top: 10px;
  }
`

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

                <NewNav />
              </Nav>
            </div>
            <div className="bar-2">
              <Nav className="d-flex justify-content-between">
                <p>{data.me.email}</p>
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
