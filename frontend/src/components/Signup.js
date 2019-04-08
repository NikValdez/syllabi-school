import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import { Card, Col } from 'react-bootstrap'
import Error from './ErrorMessage'
import Form from './styles/Form'
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
            <Col className="col-12 login-page">
              <Card>
                <Card.Header>Account</Card.Header>
                <Form
                  className="login-form"
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
                  <fieldset disabled={loading} aria-busy={loading}>
                    <h2>Sign Up for An Account</h2>
                    <Error error={error} />
                    <label htmlFor="Institution">
                      Institution
                      <Query query={INSTITUTIONS_QUERY}>
                        {({ data, error, loading }) => {
                          if (loading) return <p>Loading...</p>
                          if (error) return <p>Error : {error.message}</p>
                          return (
                            <select
                              value={this.state.institution}
                              onChange={this.handleChange}
                            >
                              <option defaultValue>
                                -- select an option --
                              </option>
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
                          )
                        }}
                      </Query>
                    </label>

                    <label htmlFor="email">
                      Email
                      <input
                        type="email"
                        name="email"
                        placeholder="email"
                        value={this.state.email}
                        onChange={this.saveToState}
                        required
                      />
                    </label>
                    <label htmlFor="name">
                      Name
                      <input
                        type="text"
                        name="name"
                        placeholder="name"
                        value={this.state.name}
                        onChange={this.saveToState}
                        required
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
                        required
                      />
                    </label>

                    <button type="submit">Sign Up!</button>
                  </fieldset>
                </Form>
              </Card>
            </Col>
          </>
        )}
      </Mutation>
    )
  }
}

export default Signup
export { SIGNUP_MUTATION }
