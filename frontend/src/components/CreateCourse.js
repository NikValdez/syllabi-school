import gql from 'graphql-tag'
import moment from 'moment'
import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import { Col, Row, Table } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import ReactHtmlParser from 'react-html-parser'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Select from 'react-select'
import { ALL_COURSES_QUERY } from './Courses'
import { Quill } from './CreateEvent'
import Error from './ErrorMessage'
import IsAdminTeacher from './IsAdminTeacher'
import Form from './styles/Form'
import { CURRENT_USER_QUERY } from './User'

const CREATE_COURSE_MUTATION = gql`
  mutation CREATE_COURSE_MUTATION(
    $title: String!
    $description: String!
    $credits: Int!
    $courseCode: String!
    $image: String
    $color: String
    $institution: ID!
    $days: String
    $startDate: DateTime
    $endDate: DateTime
  ) {
    createCourse(
      title: $title
      description: $description
      credits: $credits
      courseCode: $courseCode
      image: $image
      color: $color
      institution: $institution
      days: $days
      startDate: $startDate
      endDate: $endDate
    ) {
      id
    }
  }
`

const options = [
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' }
]

class CreateCourse extends Component {
  state = {
    title: '',
    description: '',
    credits: 0,
    courseCode: '',
    image: '',
    color: '',
    institution: '',
    selectedOption: [],
    startDate: null,
    endDate: null,
    days: ''
  }

  getRandomColor = () => {
    let hue = Math.floor(Math.random() * 360)
    let pastel = 'hsl(' + hue + ', 100%, 87.5%)'
    return pastel
  }
  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({
      [name]: val,
      color: this.getRandomColor()
    })
  }

  handleSelectionChange = selectedOption => {
    this.setState({ selectedOption })
  }
  onDescriptionChange = value => {
    this.setState({
      description: value
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedOption !== prevState.selectedOption) {
      const newArr = []
      this.state.selectedOption.map(option => newArr.push(option.value))
      const transform = JSON.stringify(newArr)
      this.setState({
        days: transform
      })
    }
  }

  handleStartDateChange = date => {
    this.setState({
      startDate: moment(date).toDate()
    })
  }
  handleEndDateChange = date => {
    this.setState({
      endDate: moment(date).toDate()
    })
  }

  render() {
    const { selectedOption } = this.state
    return (
      <IsAdminTeacher>
        <Row>
          <Col md={7} className="col-12">
            <Query query={CURRENT_USER_QUERY}>
              {({ data, error, loading }) => {
                if (error) return <p>Error : {error.message}</p>
                return (
                  <Mutation
                    mutation={CREATE_COURSE_MUTATION}
                    variables={this.state}
                    refetchQueries={[{ query: ALL_COURSES_QUERY }]}
                  >
                    {(createCourse, { loading, error }) => (
                      <Form
                        style={{ width: '100%' }}
                        onSubmit={async e => {
                          e.preventDefault()
                          await this.setState({
                            institution: data.me.institution.id
                          })
                          const res = await createCourse()
                          this.props.history.push(
                            `/courses/${res.data.createCourse.id}`
                          )
                        }}
                      >
                        <Error error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                          <label htmlFor="title">
                            Title
                            <input
                              maxLength="40"
                              type="text"
                              id="title"
                              name="title"
                              placeholder="title"
                              required
                              value={this.state.title}
                              onChange={this.handleChange}
                            />
                          </label>
                          {this.state.title.length > 39 ? (
                            <p style={{ color: '#f17070' }}>
                              Title cannot be this long
                            </p>
                          ) : (
                            ''
                          )}
                          <label htmlFor="courseCode">
                            Course Code
                            <input
                              maxLength="20"
                              type="text"
                              id="courseCode"
                              name="courseCode"
                              placeholder="Course Code"
                              required
                              value={this.state.courseCode}
                              onChange={this.handleChange}
                            />
                          </label>
                          <label htmlFor="credits">
                            Credits
                            <input
                              maxLength="20"
                              type="text"
                              id="credits"
                              name="credits"
                              placeholder="Credits"
                              required
                              value={this.state.credits}
                              onChange={this.handleChange}
                            />
                          </label>
                          <label htmlFor="description">
                            Description
                            <Quill>
                              <ReactQuill
                                placeholder="Add a description..."
                                theme="snow"
                                value={this.state.description}
                                onChange={this.onDescriptionChange}
                                modules={CreateCourse.modules}
                                formats={CreateCourse.formats}
                              />
                            </Quill>
                          </label>

                          <label htmlFor="ClassTime">
                            Class Days
                            <Select
                              value={selectedOption}
                              onChange={this.handleSelectionChange}
                              options={options}
                              isMulti
                              theme={theme => ({
                                ...theme,
                                borderRadius: 0,
                                colors: {
                                  ...theme.colors,
                                  primary25: '#fffcdf',
                                  primary: 'black'
                                }
                              })}
                            />
                          </label>
                          <label htmlFor="DateTime">
                            Class Time
                            <div style={{ marginRight: '20px' }}>
                              <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleStartDateChange}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="h:mm aa"
                                timeCaption="Time"
                                placeholderText="Class starts"
                              />
                            </div>
                            <div>
                              <DatePicker
                                selected={this.state.endDate}
                                showTimeSelect
                                showTimeSelectOnly
                                selectsEnd
                                timeIntervals={15}
                                dateFormat="h:mm aa"
                                timeCaption="Time"
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                onChange={this.handleEndDateChange}
                                placeholderText="Class ends"
                              />
                            </div>
                          </label>
                          <button
                            type="submit"
                            style={{ marginTop: '1rem', marginBottom: '6rem' }}
                          >
                            Submit
                          </button>
                        </fieldset>
                      </Form>
                    )}
                  </Mutation>
                )
              }}
            </Query>
          </Col>

          <Col md={5} className="col-12" style={{ marginTop: '5rem' }}>
            <Table bordered>
              <tbody>
                <tr>
                  <th>Title</th>
                  <td>{this.state.title}</td>
                </tr>
                <tr>
                  <th>Course Code</th>
                  <td>{this.state.courseCode}</td>
                </tr>
                <tr>
                  <th>Credits</th>
                  <td>{this.state.credits}</td>
                </tr>
                <tr>
                  <th>Course Time</th>
                  <td>
                    {this.state.days !== '' &&
                      JSON.parse(this.state.days).map(day => (
                        <div key={day} style={{ display: 'inline-block' }}>
                          <h6
                            style={{
                              marginRight: '5px',
                              fontSize: '10px',
                              color: '#a09e9e'
                            }}
                          >
                            {day.toUpperCase()}
                          </h6>
                          <div style={{ display: 'inline-block' }}>
                            <h6
                              style={{
                                marginRight: '20px',
                                fontSize: '10px'
                              }}
                            >
                              {moment(this.state.startDate).format('LT')}
                            </h6>
                            <h6
                              style={{
                                marginRight: '20px',
                                fontSize: '10px'
                              }}
                            >
                              {moment(this.state.endDate).format('LT')}
                            </h6>
                          </div>
                        </div>
                      ))}
                  </td>
                </tr>
              </tbody>
            </Table>
            <div>
              <h3>Course Description</h3>
              {ReactHtmlParser(this.state.description)}
            </div>
          </Col>
        </Row>
      </IsAdminTeacher>
    )
  }
}

CreateCourse.modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' }
    ],
    [{ font: [] }],
    ['link'],
    ['clean']
  ]
}

CreateCourse.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'indent',
  'link',
  'color'
]

export default CreateCourse
export { CREATE_COURSE_MUTATION }
