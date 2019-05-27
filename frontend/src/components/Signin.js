import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { Link } from 'react-router-dom'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'
const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`

class Signin extends Component {
  state = {
    email: '',
    password: ''
  }
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signin, { error, loading }) => (
          <>
            <form
              method="post"
              onSubmit={async e => {
                e.preventDefault()
                await signin()
                this.setState({ email: '', password: '' })
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h1 class="title is-spaced">Account</h1>
                <p className="has-text-right">
                  <Link to="/signup" className="">
                    Need an account? Sign Up
                  </Link>
                </p>

                <Error error={error} />

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
                    />
                  </label>

                  <p className="has-text-right">
                    <Link to="/request_reset">Forgot Password?</Link>
                  </p>
                </div>

                <div className="field">
                  <button
                    className="button is-fullwidth is-medium is-black"
                    type="submit"
                  >
                    Sign In
                  </button>
                </div>
              </fieldset>
            </form>
          </>
        )}
      </Mutation>
    )
  }
}

export default Signin
export { SIGNIN_MUTATION }
