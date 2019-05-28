import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { Link, withRouter } from 'react-router-dom'
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
            <section className="account">
              <form
                className="login-form"
                method="post"
                onSubmit={async e => {
                  e.preventDefault()
                  await signin()
                  this.setState({ email: '', password: '' })
                  this.props.history.push(`/`)
                }}
              >
                <fieldset
                  className="wrapper"
                  disabled={loading}
                  aria-busy={loading}
                >
                  <header className="mb-m">
                    <h1 className="title is-spaced">Account</h1>
                    <p>
                      <Link to="/signup" className="">
                        Need an account? Sign Up
                      </Link>
                    </p>
                  </header>

                  <div className="error">
                    <Error error={error} />
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

                    <p className="has-text-right">
                      <Link to="/request_reset">Forgot Password?</Link>
                    </p>
                  </div>

                  <div className="field mt-m">
                    <button
                      className="button is-fullwidth is-medium is-white is-outlined"
                      type="submit"
                    >
                      Sign In
                    </button>
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

export default withRouter(Signin)
export { SIGNIN_MUTATION }
