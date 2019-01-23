import React from 'react'
import { mount, shallow } from 'enzyme'
import Test from '../components/Test'
import { CURRENT_USER_QUERY } from '../components/User'
import { MockedProvider } from 'react-apollo/test-utils'
// import { fakeUser } from '../lib/testUtils';

it('It renders properly', () => {
  const wrapper = shallow(<Test />)
  expect(wrapper.find('This is a test'))
})

test('it works', () => {})
