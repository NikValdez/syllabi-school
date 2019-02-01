import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import Book from '../book.gif'

const INSTITUTIONS_QUERY = gql`
  query INSTITUTIONS_QUERY {
    institutions {
      id
      name
    }
  }
`

class Institutions extends Component {
  render() {
    return (
      <div>
        <Query query={INSTITUTIONS_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return <img src={Book} alt="Loading" />
            if (error) return <p>Error : {error.message}</p>
            console.log(data)
            return (
              <select>
                {data.institutions.map(institution => (
                  <option key={institution.id}>{institution.name}</option>
                ))}
              </select>
            )
          }}
        </Query>
      </div>
    )
  }
}

export default Institutions
