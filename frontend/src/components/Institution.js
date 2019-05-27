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
              <h3>
                {data.me.institution.name}
                <img src={data.me.institution.logo} alt="logo" />
              </h3>
            )
          }}
        </Query>
      </div>
    )
  }
}
