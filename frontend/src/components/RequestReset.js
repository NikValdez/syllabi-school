import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Error from './ErrorMessage'
import { Link } from 'react-router-dom'

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`

class RequestReset extends Component {
  state = {
    email: ''
  }
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(reset, { error, loading, called }) => (
          <>
            <section className="account">
              <form
                className="request-reset-form"
                data-test="form"
                method="post"
                onSubmit={async e => {
                  e.preventDefault()
                  await reset()
                  this.setState({ email: '' })
                }}
              >
                <fieldset className="wrapper" disabled={loading} aria-busy={loading}>
                  <header className="mb-m">
                    <h1 className="title is-spaced">Forgot Password?</h1>
                    <Link to="/signin" className="">
                      Or return to the Sign In
                    </Link>
                  </header>

                  <div className="error">
                    <Error error={error} />
                    {!error && !loading && called && (
                      <p>Success! Check your email for a reset link!</p>
                    )}
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

                  <div className="field mt-m">
                    <button
                      className="button is-fullwidth is-medium is-white is-outlined"
                      type="submit">Request Reset!</button>
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

export default RequestReset
export { REQUEST_RESET_MUTATION }
