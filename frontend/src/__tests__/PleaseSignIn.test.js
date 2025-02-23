import { mount } from 'enzyme'
import React from 'react'
import { MockedProvider } from 'react-apollo/test-utils'
import { BrowserRouter as Router } from 'react-router-dom'
import wait from 'waait'
import PleaseSignIn from '../components/PleaseSignIn'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser } from '../lib/testUtils'

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } }
  }
]

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } }
  }
]

describe('<PleaseSignIn/>', () => {
  it('renders the sign in dialog to logged out users', async () => {
    const wrapper = mount(
      <Router>
        <MockedProvider mocks={notSignedInMocks}>
          <PleaseSignIn />
        </MockedProvider>
      </Router>
    )
    await wait()
    wrapper.update()
    expect(wrapper.text()).toContain('Sign In')
    const SignIn = wrapper.find('Signin')
    expect(SignIn.exists()).toBe(true)
  })

  it('renders the child component when the user is signed in', async () => {
    const Hey = () => <p>Hey!</p>
    const wrapper = mount(
      <Router>
        <MockedProvider mocks={signedInMocks}>
          <Hey />
        </MockedProvider>
      </Router>
    )

    await wait()
    wrapper.update()
    // expect(wrapper.find('Hey').exists()).toBe(true);
    expect(wrapper.contains(<Hey />)).toBe(true)
  })
})
