import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import React from 'react'
import { MockedProvider } from 'react-apollo/test-utils'
import Signup, { SIGNUP_MUTATION } from '../components/Signup'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser } from '../lib/testUtils'

// function type(wrapper, name, value) {
//   wrapper.find(`input[name="${name}"]`).simulate('change', {
//     target: { name, value }
//   })
// }

const me = fakeUser()
const mocks = [
  // signup mock mutation
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        name: me.name,
        email: me.email,
        password: 'password',
        institution: me.institution
      }
    },
    result: {
      data: {
        signup: {
          __typename: 'User',
          id: 'abc123',
          email: me.email,
          name: me.name,
          institution: me.institution
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

describe('<Signup/>', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <Signup />
      </MockedProvider>
    )
    expect(toJSON(wrapper.find('form'))).toMatchSnapshot()
  })

  // it('calls the mutation properly', async () => {
  //   let apolloClient
  //   const wrapper = mount(
  //     <MockedProvider mocks={mocks}>
  //       <ApolloConsumer>
  //         {client => {
  //           apolloClient = client
  //           return <Signup />
  //         }}
  //       </ApolloConsumer>
  //     </MockedProvider>
  //   )
  //   await wait()
  //   wrapper.update()

  //   console.log(wrapper.debug())

  //   wrapper.find('input[type="email"]').simulate('change', {
  //     target: { name: 'email', value: me.email }
  //   })
  //   wrapper.find('input[type="text"]').simulate('change', {
  //     target: { name: 'name', value: me.name }
  //   })
  //   wrapper.find('input[type="password"]').simulate('change', {
  //     target: { name: 'password', value: 'password' }
  //   })
  //   wrapper.find('select').simulate('change', {
  //     target: { value: me.institution }
  //   })
  //   // type(wrapper, 'name', me.name)
  //   // type(wrapper, 'email', me.email)
  //   // type(wrapper, 'password', 'password')
  //   // type(wrapper, 'institution', me.institution)
  //   wrapper.update()
  //   wrapper.find('form').simulate('submit')
  //   await wait()
  //   // query the user out of the apollo client
  //   const user = await apolloClient.query({ query: CURRENT_USER_QUERY })
  //   expect(user.data.me).toMatchObject(me)
  //   })
})
