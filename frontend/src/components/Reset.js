import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Error from './ErrorMessage'
import { CURRENT_USER_QUERY } from './User'

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`

class Reset extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired
  }
  state = {
    password: '',
    confirmPassword: ''
  }
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  render() {
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken: this.props.match.params.resetToken,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword
        }}
        refetchQueries={[
          {
            query: CURRENT_USER_QUERY
          }
        ]}
      >
        {(reset, { error, loading, called }) => (
          <section className="account">
            <form
              className="reset-form"
              method="post"
              onSubmit={async e => {
                e.preventDefault()
                await reset()
                this.setState({ password: '', confirmPassword: '' })
              }}
            >
              <fieldset className="wrapper" disabled={loading} aria-busy={loading}>
                <header className="mb-m">
                  <h2>Reset Your Password</h2>
                </header>

                <div className="error">
                  <Error error={error} />
                </div>

                <div className="field">
                  <label className="label" htmlFor="password">
                    Password
                    <input
                      className="input"
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={this.state.password}
                      onChange={this.saveToState}
                    />
                  </label>
                </div>
                
                <div className="field">
                  <label className="label" htmlFor="confirmpassword">
                    Confirm Your Password
                    <input
                      className="input"
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={this.state.confirmPassword}
                      onChange={this.saveToState}
                    />
                  </label>
                </div>

                <button
                  className="button is-fullwidth is-medium is-white is-outlined"
                  type="submit">Reset Your Password</button>
              </fieldset>
            </form>
          </section>
        )}
      </Mutation>
    )
  }
}

export default Reset
export { RESET_MUTATION }
