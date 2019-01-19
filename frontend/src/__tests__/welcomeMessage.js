import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Courses from '../components/Courses'

const course = {
  title: 'physics 101'
}

describe('<Courses />', () => {
  it('renders and displays properly', () => {
    const wrapper = shallow(<Courses />)
    const cour = toJson(wrapper)
    // expect(wrapper.find('h1').text()).toBe(fakeCourse.title)

    console.log(cour.debug())
  })
})

// const wrapper = shallow(<WelcomeMessage />)

// describe('displays an h1', () => {
//   it('Should have an h1', () => {
//     expect(wrapper.find('h1').exists()).toBe(true)
//   })
// })
