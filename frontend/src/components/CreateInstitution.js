import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Error from './ErrorMessage'
import IsAdminTeacher from './IsAdminTeacher'

const CREATE_INSTITUTION_MUTATION = gql`
  mutation CREATE_INSTITUTION_MUTATION($name: String!, $logo: String) {
    createInstitution(name: $name, logo: $logo) {
      id
    }
  }
`

class CreateInstitution extends Component {
  state = {
    name: '',
    logo: '',
    loading: false
  }

  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  uploadFile = async e => {
    const files = e.target.files
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', 'schedule')
    this.setState({ loading: true })
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/nikcochran/raw/upload/',
      {
        method: 'POST',
        body: data
      }
    )
    const file = await res.json()
    // console.log(file)
    this.setState({
      logo: file.secure_url,
      loading: false
    })
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
              <form
                onSubmit={async e => {
                  e.preventDefault()
                  await createInstitution()
                  this.props.history.push(`/`)
                }}
              >
                <Error error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
                  <label htmlFor="name">
                    Name
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
                  <label htmlFor="file">
                    <button>
                      <button>Upload an Image</button>
                      <input
                        type="file"
                        id="file"
                        name="file"
                        placeholder="Upload an image"
                        onChange={this.uploadFile}
                      />
                    </button>
                    {this.state.loading ? <p>Loading...</p> : null}
                    {this.state.logo && (
                      <div>
                        <img src={this.state.logo} alt="School logo" />
                      </div>
                    )}
                  </label>

                  <button type="submit" disabled={this.state.loading}>
                    Submit
                  </button>
                </fieldset>
              </form>
            )}
          </Mutation>
        </IsAdminTeacher>
      </>
    )
  }
}

export default CreateInstitution
export { CREATE_INSTITUTION_MUTATION }
