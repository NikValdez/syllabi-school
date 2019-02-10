import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { CURRENT_USER_QUERY } from './User'

export default class Institution extends Component {
  render() {
    return (
      <div>
        <Query query={CURRENT_USER_QUERY}>
          {({ error, loading, data }) => {
            if (error) return <p>Error</p>
            if (loading) return <p>Loading...</p>

            return (
              <h3 style={{ marginRight: '25px', fontSize: '18px' }}>
                {data.me.institution.name}
                <img
                  src={data.me.institution.logo}
                  alt="logo"
                  style={{ width: '30px', marginLeft: '20px' }}
                />
              </h3>
            )
          }}
        </Query>
      </div>
    )
  }
}
