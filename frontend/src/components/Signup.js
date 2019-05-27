import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import Error from './ErrorMessage'
import { Link } from 'react-router-dom'
import { CURRENT_USER_QUERY } from './User'

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
    $institution: ID
  ) {
    signup(
      email: $email
      name: $name
      password: $password
      institution: $institution
    ) {
      id
      email
      name
      institution {
        id
        name
      }
    }
  }
`

const INSTITUTIONS_QUERY = gql`
  query INSTITUTIONS_QUERY {
    institutions {
      id
      name
    }
  }
`

class Signup extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    institution: ''
  }
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleChange = e => {
    this.setState({ institution: e.target.value })
  }

  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { error, loading }) => (
          <>
            <section className="account">
              <form
                className="register-form"
                method="post"
                onSubmit={async e => {
                  e.preventDefault()
                  await signup()
                  this.setState({
                    name: '',
                    email: '',
                    password: '',
                    institution: ''
                  })
                  this.props.history.push(`/`)
                }}
              >
                <fieldset className="wrapper" disabled={loading} aria-busy={loading}>

                  <header className="mb-m">
                    <h1 className="title is-spaced">Register</h1>
                    <p>
                      <Link to="/signin" className="">
                        Already have an Account? Sign In
                      </Link>
                    </p>
                  </header>

                  <div className="error">
                    <Error error={error} />
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="Institution">
                      Show
                      <Query query={INSTITUTIONS_QUERY}>
                        {({ data, error, loading }) => {
                          if (loading) return <p>Loading...</p>
                          if (error) return <p>Error : {error.message}</p>
                          return (
                            <div className="select is-rounded">
                              <select
                                value={this.state.institution}
                                onChange={this.handleChange}
                              >
                                <option defaultValue>-- select an option --</option>
                                {data.institutions.map(institution => (
                                  <option
                                    key={institution.id}
                                    value={institution.id}
                                    required
                                  >
                                    {institution.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )
                        }}
                      </Query>
                    </label>
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="name">
                      Name
                      <input
                        className="input"
                        type="text"
                        name="name"
                        placeholder="name"
                        value={this.state.name}
                        onChange={this.saveToState}
                        required
                      />
                    </label>
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="email">
                      Email
                      <input
                        className="input"
                        type="email"
                        name="email"
                        placeholder="email"
                        value={this.state.email}
                        onChange={this.saveToState}
                        required
                      />
                    </label>
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="password">
                      Password
                      <input
                        className="input"
                        type="password"
                        name="password"
                        placeholder="password"
                        value={this.state.password}
                        onChange={this.saveToState}
                        required
                      />
                    </label>
                  </div>

                  <div className="field mt-m">
                    <button
                      className="button is-fullwidth is-medium is-white is-outlined"
                      type="submit">Sign Up!</button>
                  </div>
                </fieldset>
              </form>
            </section>
          </>
        )}
      </Mutation>
    )
  }
}

export default Signup
export { SIGNUP_MUTATION }
