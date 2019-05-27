import gql from 'graphql-tag'
import htmlToText from 'html-to-text'
import moment from 'moment'
import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import { ALL_COURSES_QUERY } from './Courses'

const EDIT_COURSE_QUERY = gql`
  query EDIT_COURSE_QUERY($id: ID!) {
    course(where: { id: $id }) {
      id
      title
      description
      credits
      courseCode
    }
  }
`
const UPDATE_COURSE_MUTATION = gql`
  mutation UPDATE_COURSE_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $credits: Int
    $courseCode: String
    $days: String
    $startDate: DateTime
    $endDate: DateTime
  ) {
    updateCourse(
      id: $id
      title: $title
      description: $description
      credits: $credits
      courseCode: $courseCode
      days: $days
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      title
      description
      credits
      courseCode
      days
      startDate
      endDate
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

class UpdateCourse extends Component {
  state = {}

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
  handleSelectionChange = selectedOption => {
    this.setState({ selectedOption })
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

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val })
  }

  updateCourse = async (e, updateCourseMutation) => {
    e.preventDefault()
    await updateCourseMutation({
      variables: {
        id: this.props.match.params.id,
        ...this.state
      }
    })
    this.props.history.push(`/courses/${this.props.match.params.id}`)
  }
  render() {
    return (
      <Query
        query={EDIT_COURSE_QUERY}
        variables={{
          id: this.props.match.params.id
        }}
      >
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>
          if (!data.course)
            return <p>No Course Found For ID {this.props.match.params.id}</p>
          return (
            <Mutation
              mutation={UPDATE_COURSE_MUTATION}
              variables={this.state}
              refetchQueries={[{ query: ALL_COURSES_QUERY }]}
            >
              {(updateCourse, { loading, error }) => (
                <form
                  onSubmit={e =>
                    this.updateCourse(e, updateCourse).catch(err => {
                      alert(err.message)
                    })
                  }
                >
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="title"
                        required
                        defaultValue={data.course.title}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="courseCode">
                      Owner(s)
                      <input
                        type="text"
                        id="courseCode"
                        name="courseCode"
                        placeholder="Course Code"
                        required
                        defaultValue={data.course.courseCode}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="credits">
                      Extension
                      <input
                        type="text"
                        id="credits"
                        name="credits"
                        placeholder="Credits"
                        required
                        defaultValue={data.course.credits}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="description">
                      Additional Information
                      <textarea
                        type="text"
                        id="description"
                        name="description"
                        placeholder="description"
                        required
                        defaultValue={htmlToText.fromString(
                          data.course.description
                        )}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="ClassTime">
                      Office Days
                      <Select
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
                      Office Hours
                      <div>
                        <DatePicker
                          selected={
                            this.state.startDate ||
                            moment(data.course.startDate).toDate()
                          }
                          onChange={this.handleStartDateChange}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          dateFormat="h:mm aa"
                          timeCaption="Time"
                          placeholderText="Class starts"
                          openToDate={moment(data.course.startDate).toDate()}
                        />
                      </div>
                      <div>
                        <DatePicker
                          selected={
                            this.state.endDate ||
                            moment(data.course.endtDate).toDate()
                          }
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
                          openToDate={moment(data.course.endDate).toDate()}
                        />
                      </div>
                    </label>
                    <button type="submit">Save Changes</button>
                  </fieldset>
                </form>
              )}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}

export default UpdateCourse
export { UPDATE_COURSE_MUTATION }
