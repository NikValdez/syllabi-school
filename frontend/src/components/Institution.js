import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { CURRENT_USER_QUERY } from './User'

export default class Institution extends Component {
  render() {
    return (
      <header>
        <Query query={CURRENT_USER_QUERY}>
          {({ error, loading, data }) => {
            if (error) return <p>Error</p>
            if (loading)
              return (
                <progress class="progress is-small is-primary" max="100">
                  15%
                </progress>
              )

            return (
              <p>
                <img src={data.me.institution.logo} alt="logo" />
                {data.me.institution.name}
              </p>
            )
          }}
        </Query>
      </header>
    )
  }
}
