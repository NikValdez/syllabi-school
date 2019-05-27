import React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'
import Institution from './Institution'
import HeaderNav from './Nav'
import { CURRENT_USER_QUERY } from './User'

const Header = () => (
  <div>
    <Query query={CURRENT_USER_QUERY}>
      {({ data, error, loading }) => {
        if (error) return <p>Error : {error.message}</p>
        if (loading) return <p>Loading</p>

        return (
          <>
            <div>
              <nav>
                <div>
                  <Link to="/">Syllabi</Link>
                </div>

                <HeaderNav />
              </nav>
            </div>
            <div>
              <nav>
                <div>
                  <p>{data.me.name}</p>
                  <p>{data.me.email}</p>
                </div>
                <div />
                <div>
                  <Institution />
                </div>
              </nav>
            </div>
          </>
        )
      }}
    </Query>
  </div>
)

export default Header
