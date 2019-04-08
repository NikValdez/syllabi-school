import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { Card, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Error from './ErrorMessage'
import Form from './styles/Form'
import './styles/Login.css'
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
            <Col className="col-12 login-page">
              <Card>
                <Card.Header>Account</Card.Header>
                <Form
                  className="login-form"
                  method="post"
                  onSubmit={async e => {
                    e.preventDefault()
                    await signin()
                    this.setState({ email: '', password: '' })
                  }}
                >
                  <fieldset disabled={loading} aria-busy={loading}>
                    <h2>Sign In</h2>
                    <Error error={error} />
                    <label htmlFor="email">
                      Email
                      <input
                        type="email"
                        name="email"
                        placeholder="email"
                        value={this.state.email}
                        onChange={this.saveToState}
                      />
                    </label>

                    <label htmlFor="password">
                      Password
                      <input
                        type="password"
                        name="password"
                        placeholder="password"
                        value={this.state.password}
                        onChange={this.saveToState}
                      />
                    </label>

                    <button type="submit">Sign In!</button>
                  </fieldset>
                  <Link to="/signup" style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        width: '80%',
                        margin: '0 auto',
                        marginTop: '10px'
                      }}
                    >
                      Sign Up
                    </button>
                  </Link>
                  <Link to="/request_reset" style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        width: '70%',
                        margin: '0 auto',
                        marginTop: '10px',
                        textDecoration: 'none'
                      }}
                    >
                      Forgot Password?
                    </button>
                  </Link>
                </Form>
              </Card>
            </Col>
          </>
        )}
      </Mutation>
    )
  }
}

export default Signin
export { SIGNIN_MUTATION }
