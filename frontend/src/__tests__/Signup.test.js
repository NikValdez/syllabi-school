import { mount } from 'enzyme'
import React from 'react'
import { MockedProvider } from 'react-apollo/test-utils'
import Signup, { SIGNUP_MUTATION } from '../components/Signup'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser } from '../lib/testUtils'

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

// function updateInput(wrapper, name, value) {
//   return wrapper.find(`input[name="${name}"]`).simulate('change', {
//     target: { name, value }
//   })
// }

// const updateInput = (wrapper, instance, newValue) => {
//   const input = wrapper.find(instance)

//   input.simulate('change', {
//     currentTarget: { value: newValue }
//   })
//   return wrapper.find(instance)
// }

describe('<Signup/>', () => {
  it('Should render without error', async () => {
    const wrapper = mount(
      <MockedProvider>
        <Signup />
      </MockedProvider>
    )

    // expect(wrapper.find('h2').exists()).to.equal(true)
  })

  it('Form contents appear correctly', () => {
    const wrapper = mount(
      <MockedProvider>
        <Signup />
      </MockedProvider>
    )
    // console.log(wrapper.debug())
    expect(wrapper.exists('form')).toBe(true)
    expect(wrapper.exists('input[name="name"]')).toBe(true)
    expect(wrapper.exists('input[name="email"]')).toBe(true)
    expect(wrapper.exists('input[name="password"]')).toBe(true)

    // console.log(wrapper.debug())
    // const nameInput = updateInput(wrapper, 'name', 'Nik')

    // const emailInput = updateInput(wrapper, 'email', 'test@gmail.com')
    // const passwordInput = updateInput(wrapper, 'password', 'password')

    // expect(nameInput.props().value).toBe('Nik')
    // expect(emailInput.props().value).toBe('test@gmail.com')
    // expect(passwordInput.props().value).toBe('password')
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
  //   type(wrapper, 'name', me.name)
  //   type(wrapper, 'email', me.email)
  //   type(wrapper, 'password', 'password')
  //   type(wrapper, 'insitution')
  //     wrapper.update()
  //     wrapper.find('form').simulate('submit')
  //     await wait()
  //     // query the user out of the apollo client
  // const user = await apolloClient.query({ query: CURRENT_USER_QUERY })
  //     expect(user.data.me).toMatchObject(me)
  // })
})
