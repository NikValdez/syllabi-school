import { mount } from 'enzyme'
import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { MockedProvider } from 'react-apollo/test-utils'
import { MemoryRouter } from 'react-router-dom'
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
  // signup mock mutation
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
  //   it('renders and matches snapshot', async () => {
  //     const wrapper = mount(
  //       <MockedProvider>
  //         <Signup />
  //       </MockedProvider>
  //     );
  //     expect(toJSON(wrapper.find('form'))).toMatchSnapshot();
  //   });

  it('calls the mutation properly', async () => {
    let apolloClient
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client
            return (
              <MemoryRouter>
                <Signin />
              </MemoryRouter>
            )
          }}
        </ApolloConsumer>
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    type(wrapper, 'email', me.email)
    type(wrapper, 'password', 'password')
    wrapper.update()
    wrapper.find('form').simulate('submit')

    await wait()
    wrapper.update()
    expect(wrapper.exists('input[name="password"]')).toBe(true)
    // const user = await apolloClient.query({ query: CURRENT_USER_QUERY })
    // expect(userdata.me).toMatchObject(me)
    // expect(wrapper.prop('onSubmit') === 'submit')

    // query the user out of the apollo client
  })
})
