import gql from 'graphql-tag'
import moment from 'moment'
import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import DatePicker from 'react-datepicker'
import ReactHtmlParser from 'react-html-parser'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Select from 'react-select'
import { ALL_COURSES_QUERY } from './Courses'
import Error from './ErrorMessage'
import IsAdminTeacher from './IsAdminTeacher'
import { CURRENT_USER_QUERY } from './User'

const CREATE_COURSE_MUTATION = gql`
  mutation CREATE_COURSE_MUTATION(
    $title: String!
    $description: String!
    $credits: Int
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
    credits: '',
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

  onCreditsChange = e => {
    this.setState({
      credits: parseInt(e.target.value) || 0
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
        <section className="container py-m">
          <h1 className="title is-spaced">New Department</h1>
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
                    <form
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
                        <div className="field">
                          <label className="label" htmlFor="title">
                            Department
                            <input
                              className="input"
                              maxLength="40"
                              type="text"
                              id="title"
                              name="title"
                              placeholder="Department"
                              required
                              value={this.state.title}
                              onChange={this.handleChange}
                            />
                          </label>
                          {this.state.title.length > 39 ? (
                            <p>Title cannot be this long</p>
                          ) : (
                            ''
                          )}
                        </div>

                        <div className="field">
                          <label className="label" htmlFor="courseCode">
                            Owner(s)
                            <input
                              className="input"
                              type="text"
                              id="courseCode"
                              name="courseCode"
                              placeholder="ex) Matt Visser, matt@syllabi.com"
                              required
                              value={this.state.courseCode}
                              onChange={this.handleChange}
                            />
                          </label>
                        </div>

                        <div className="field">
                          <label className="label" htmlFor="credits">
                            Extension
                            <input
                              className="input"
                              maxLength="20"
                              type="text"
                              id="credits"
                              name="credits"
                              placeholder="Extension #"
                              required
                              value={this.state.credits}
                              onChange={this.onCreditsChange}
                            />
                          </label>
                        </div>

                        <div className="field">
                          <label className="label" htmlFor="ClassTime">
                            Office Days
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
                        </div>

                        <div className="field">
                          <label className="label" htmlFor="DateTime">
                            Office Hours
                            <DatePicker
                              selected={this.state.startDate}
                              onChange={this.handleStartDateChange}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              dateFormat="h:mm aa"
                              timeCaption="Time"
                              placeholderText="Start Time"
                              className="full-width"
                            />
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
                              placeholderText="End Time"
                              className="full-width"
                            />
                          </label>
                        </div>

                        <label className="label py-s" htmlFor="description">
                          Additional Information
                          <div>
                            <ReactQuill
                              placeholder="Add a description..."
                              theme="snow"
                              value={this.state.description}
                              onChange={this.onDescriptionChange}
                              modules={CreateCourse.modules}
                              formats={CreateCourse.formats}
                            />
                          </div>
                        </label>

                        <button className="button is-black" type="submit">
                          Submit
                        </button>
                      </fieldset>
                    </form>
                  )}
                </Mutation>
              )
            }}
          </Query>

          <table className="table mt-m is-bordered is-fullwidth is-hoverable">
            <tbody>
              <tr>
                <th>Department</th>
                <td>{this.state.title}</td>
              </tr>
              <tr>
                <th>Owner(s)</th>
                <td>{this.state.courseCode}</td>
              </tr>
              <tr>
                <th>Extension</th>
                <td>{this.state.credits}</td>
              </tr>
              <tr>
                <th>Office Hours</th>
                <td>
                  {this.state.days !== '' &&
                    JSON.parse(this.state.days).map(day => (
                      <div key={day}>
                        <h6>{day.toUpperCase()}</h6>
                        <div>
                          <h6>{moment(this.state.startDate).format('LT')}</h6>
                          <h6>{moment(this.state.endDate).format('LT')}</h6>
                        </div>
                      </div>
                    ))}
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <h3>Additional Information</h3>
            {ReactHtmlParser(this.state.description)}
          </div>
        </section>
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
