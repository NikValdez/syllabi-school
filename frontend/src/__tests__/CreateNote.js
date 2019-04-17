import { mount } from 'enzyme'
import React from 'react'
import { MockedProvider } from 'react-apollo/test-utils'
import CreateNote from '../components/CreateNote'

describe('<CreateNote/>', () => {
  it('renders compenent properly', async () => {
    const submitForm = jest.fn()
    const wrapper = mount(
      <MockedProvider>
        <CreateNote onSubmit={submitForm} />
      </MockedProvider>
    )
    expect(wrapper.find('form')).toHaveLength(1)
    expect(wrapper.find('input')).toHaveLength(1)
    wrapper.find('input').simulate('change', {
      target: { name: 'note', value: 'This is a test note' }
    })
    wrapper.find('form').simulate('submit')

    // expect(submitForm).toHaveBeenCalledTimes(1)
  })
})
