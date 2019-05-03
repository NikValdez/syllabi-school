import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { Mutation, Query } from 'react-apollo'
import Error from './ErrorMessage'
import Button from './styles/Button'
import Container from './styles/Container'
import { TableStyles, TdStyles, ThStyles, TrStyles } from './styles/Table'

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
        <Container>
          <Error error={error} />
          <h2 style={{ marginTop: '20px' }}>Manage Permissions</h2>

          <TableStyles>
            <thead>
              <TrStyles>
                <ThStyles>Name</ThStyles>
                <ThStyles>Email</ThStyles>
                {possiblePermissions.map(permission => (
                  <ThStyles key={permission}>{permission}</ThStyles>
                ))}
                <ThStyles>👇</ThStyles>
              </TrStyles>
            </thead>
            <tbody>
              {data.users.map(user => (
                <UserPermissions user={user} key={user.id} />
              ))}
            </tbody>
          </TableStyles>
          <div style={{ marginBottom: '20rem' }} />
        </Container>
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
            <TrStyles>
              <TdStyles>{user.name}</TdStyles>
              <TdStyles>{user.email}</TdStyles>
              {possiblePermissions.map(permission => (
                <TdStyles key={permission}>
                  <label htmlFor={`${user.id}-permission-${permission}`}>
                    <input
                      id={`${user.id}-permission-${permission}`}
                      type="checkbox"
                      checked={this.state.permissions.includes(permission)}
                      value={permission}
                      onChange={this.handlePermissionChange}
                    />
                  </label>
                </TdStyles>
              ))}
              <TdStyles>
                <Button
                  type="button"
                  disabled={loading}
                  onClick={updatePermissions}
                >
                  Updat{loading ? 'ing' : 'e'}
                </Button>
              </TdStyles>
            </TrStyles>
          </>
        )}
      </Mutation>
    )
  }
}

export default Permissions
