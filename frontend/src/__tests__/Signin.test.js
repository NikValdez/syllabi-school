import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { MockedProvider } from 'react-apollo/test-utils'
import { BrowserRouter as Router } from 'react-router-dom'
import wait from 'waait'
import Signin, { SIGNIN_MUTATION } from '../components/Signin'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser } from '../lib/testUtils'

function type(wrapper, name, value) {
  wrapper.find(`input[name="${name}"]`).simulate('change', {
    target: { name, value }
  })
}

const me = fakeUser()
const mocks = [
  // signin mock mutation
  {
    request: {
      query: SIGNIN_MUTATION,
      variables: {
        email: me.email,
        password: 'password'
      }
    },
    result: {
      data: {
        signin: {
          __typename: 'User',
          id: 'abc123',
          email: me.email
        }
      }
    }
  },
  // current user query mock
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me } }
  }
]

describe('<Signin/>', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <Router>
        <MockedProvider>
          <Signin />
        </MockedProvider>
      </Router>
    )
    expect(toJSON(wrapper.find('form'))).toMatchSnapshot()
    expect(wrapper.find('form').length).toBe(1)
    expect(wrapper.find('Link').length).toBe(2)
  })

  it('calls the mutation properly', async () => {
    let apolloClient
    const wrapper = mount(
      <Router>
        <MockedProvider mocks={mocks}>
          <ApolloConsumer>
            {client => {
              apolloClient = client
              return <Signin onSubmit={jest.fn()} />
            }}
          </ApolloConsumer>
        </MockedProvider>
      </Router>
    )
    await wait()
    wrapper.update()
    // console.log(wrapper.debug())
    type(wrapper, 'email', me.email)
    type(wrapper, 'password', 'password')
    wrapper.update()
    wrapper.setState({ email: me.email, password: 'password' })
    expect(wrapper.state('email')).toEqual(me.email)
    expect(wrapper.state('password')).toEqual('password')

    await wait()
    wrapper.update()
    wrapper.find('form').simulate('submit')
    await wait()
    wrapper.update()
    // expect(jest.fn()).toHaveBeenCalledTimes(1)

    wrapper.update()

    // // query the user out of the apollo client
    // const user = await apolloClient.query({ query: CURRENT_USER_QUERY })
    // expect(user.data.me).toMatchObject(me)
  })
})

// expect(testValues.handleSubmit).toBeCalledWith({username: testValues.username, password: testValues.password});
