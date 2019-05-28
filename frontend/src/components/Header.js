import React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import Institution from './Institution'
import HeaderNav from './Nav'
import { CURRENT_USER_QUERY } from './User'

const Header = () => (
  <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="container">
      <Query query={CURRENT_USER_QUERY}>
        {({ data, error, loading }) => {
          if (error) return <p>Error : {error.message}</p>
          if (loading) return <p>Loading</p>

          return (
            <>
              <div className="navbar-brand">
                <div className="navbar-item">
                  <Link to="/">
                    <Institution />
                  </Link>
                </div>

                <button
                  className="navbar-burger burger"
                  aria-label="menu"
                  aria-expanded="false"
                  data-target="navbarMenu"
                >
                  <span aria-hidden="true" />
                  <span aria-hidden="true" />
                  <span aria-hidden="true" />
                </button>
              </div>

              <HeaderNav />
            </>
          )
        }}
      </Query>
    </div>
  </nav>
)

export default Header
