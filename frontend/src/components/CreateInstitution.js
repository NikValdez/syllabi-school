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
        <section className="container py-m">
          <h1 className="title is-spaced">New Show</h1>
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
                    <div className="field">
                      <label className="label" htmlFor="name">
                        Name
                        <input
                          className="input"
                          type="text"
                          id="name"
                          name="name"
                          placeholder="Name..."
                          required
                          value={this.state.name}
                          onChange={this.handleChange}
                        />
                      </label>
                    </div>

                    <div className="field file has-name">
                      <label className="file-label" htmlFor="file">
                        <input
                          className="file-input"
                          type="file"
                          id="file"
                          name="file"
                          placeholder="Upload an image"
                          onChange={this.uploadFile}
                        />
                        <span className="file-cta">
                          <span className="file-icon">
                            <i className="fas fa-upload"></i>
                          </span>
                          <span className="file-label">
                            Upload a file…
                          </span>
                        </span>
                      </label>
                    </div>

                    <div className="py-s">
                      {this.state.loading ? <p>Loading...</p> : null}
                      {this.state.logo && (
                        <img className="image is-64x64" src={this.state.logo} alt="School logo" />
                      )}
                    </div>

                    <div className="field">
                      <button className="button is-black" type="submit" disabled={this.state.loading}>
                        Submit
                      </button>
                    </div>
                  </fieldset>
                </form>
              )}
            </Mutation>
          </IsAdminTeacher>
        </section>
      </>
    )
  }
}

export default CreateInstitution
export { CREATE_INSTITUTION_MUTATION }
