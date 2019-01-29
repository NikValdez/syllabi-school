import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Error from './ErrorMessage'
import IsAdminTeacher from './IsAdminTeacher'
import Form from './styles/Form'

const CREATE_INSTITUTION_MUTATION = gql`
  mutation CREATE_INSTITUTION_MUTATION($name: String!, $logo: String) {
    createInstitution(name: $name, logo: $logo) {
      id
      name
      logo
    }
  }
`

class CreateInstitution extends Component {
  state = {
    name: '',
    logo: ''
  }

  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  render() {
    return (
      <>
        <IsAdminTeacher>
          <Mutation
            mutation={CREATE_INSTITUTION_MUTATION}
            variables={this.state}
          >
            {(createInstitution, { loading, error }) => (
              <Form
                onSubmit={async e => {
                  e.preventDefault()
                  const res = await createInstitution()
                  this.props.history.push(`/`)
                }}
              >
                <Error error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
                  <label htmlFor="title">
                    Title
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Name..."
                      required
                      value={this.state.name}
                      onChange={this.handleChange}
                    />
                  </label>

                  <button type="submit">Submit</button>
                </fieldset>
              </Form>
            )}
          </Mutation>
        </IsAdminTeacher>
      </>
    )
  }
}

export default CreateInstitution
export { CREATE_INSTITUTION_MUTATION }
