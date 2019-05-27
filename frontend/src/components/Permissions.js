import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { Mutation, Query } from 'react-apollo'
import Error from './ErrorMessage'

const possiblePermissions = ['ADMIN', 'TEACHER', 'USER', 'PERMISSIONUPDATE']

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>
      return (
        <div>
          <Error error={error} />
          <h2>Manage Permissions</h2>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map(permission => (
                  <th key={permission}>{permission}</th>
                ))}
                <th>Save Update</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(user => (
                <UserPermissions user={user} key={user.id} />
              ))}
            </tbody>
          </table>
          <div />
        </div>
      )
    }}
  </Query>
)

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array
    }).isRequired
  }
  state = {
    permissions: this.props.user.permissions
  }

  handlePermissionChange = e => {
    const checkbox = e.target

    let updatedPermissions = [...this.state.permissions]
    //figure out if we need to add or remove permission
    if (checkbox.checked) {
      //add it
      updatedPermissions.push(checkbox.value)
    } else {
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== checkbox.value
      )
    }
    this.setState({ permissions: updatedPermissions })
  }
  render() {
    const user = this.props.user
    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions: this.state.permissions,
          userId: this.props.user.id
        }}
      >
        {(updatePermissions, { loading, error }) => (
          <>
            {error && (
              <tr>
                <td colspan="8">
                  <Error error={error} />
                </td>
              </tr>
            )}
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {possiblePermissions.map(permission => (
                <td key={permission}>
                  <label htmlFor={`${user.id}-permission-${permission}`}>
                    <input
                      id={`${user.id}-permission-${permission}`}
                      type="checkbox"
                      checked={this.state.permissions.includes(permission)}
                      value={permission}
                      onChange={this.handlePermissionChange}
                    />
                  </label>
                </td>
              ))}
              <td>
                <button
                  type="button"
                  disabled={loading}
                  onClick={updatePermissions}
                >
                  Updat{loading ? 'ing' : 'e'}
                </button>
              </td>
            </tr>
          </>
        )}
      </Mutation>
    )
  }
}

export default Permissions
