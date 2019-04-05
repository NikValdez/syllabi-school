import gql from 'graphql-tag'
import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import Book from '../book.gif'
import { UploadPreview } from './CreateEvent'
import Error from './ErrorMessage'
import IsAdminTeacher from './IsAdminTeacher'
import Form from './styles/Form'
import UploadButton from './styles/UploadButton'

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
              <Form
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
                    <UploadButton>
                      <button>Upload an Image ⬆️</button>
                      <input
                        type="file"
                        id="file"
                        name="file"
                        placeholder="Upload an image"
                        onChange={this.uploadFile}
                      />
                    </UploadButton>
                    {this.state.loading ? (
                      <img
                        src={Book}
                        alt="Loading"
                        style={{ width: '100px' }}
                      />
                    ) : null}
                    {this.state.logo && (
                      <UploadPreview>
                        <img
                          src={this.state.logo}
                          alt="School logo"
                          style={{ width: '40px' }}
                        />
                      </UploadPreview>
                    )}
                  </label>

                  <button
                    type="submit"
                    disabled={this.state.loading}
                    style={{ marginBottom: '25rem' }}
                  >
                    Submit
                  </button>
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
