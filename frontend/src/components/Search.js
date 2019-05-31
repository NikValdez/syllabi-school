import Downshift from 'downshift'
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'
import React, { Component } from 'react'
import { ApolloConsumer } from 'react-apollo'
import { Link } from 'react-router-dom'
import AddCourse from './AddCourse'

const SEARCH_COURSES_QUERY = gql`
  query SEARCH_COURSES_QUERY($searchTerm: String!) {
    courses(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      title
    }
  }
`

class Search extends Component {
  state = {
    courses: [],
    loading: false
  }
  onChange = debounce(async (e, client) => {
    this.setState({ loading: true })
    const res = await client.query({
      query: SEARCH_COURSES_QUERY,
      variables: { searchTerm: e.target.value.toUpperCase() }
    })
    this.setState({
      courses: res.data.courses,
      loading: false
    })
  }, 300)
  render() {
    return (
      <aside className="menu full-width pb">
        <p className="menu-label">Add a Course</p>
        <div className="field">
          <Downshift itemToString={item => (item ? item.title : '')}>
            {({
              getInputProps,
              getItemProps,
              isOpen,
              inputValue,
              highlightedIndex
            }) => (
              <div className="field">
                <ApolloConsumer>
                  {client => (
                    <input
                      {...getInputProps({
                        type: 'search',
                        placeholder: 'Search...',
                        id: 'search',
                        className: 'input is-rounded full-width',
                        onChange: e => {
                          e.persist()
                          this.onChange(e, client)
                        }
                      })}
                    />
                  )}
                </ApolloConsumer>
                {isOpen && (
                  <ul className="menu-list py-s">
                    {this.state.courses.map((item, index) => (
                      <li
                        {...getItemProps({ item })}
                        key={item.id}
                        // highlighted={index === highlightedIndex}
                      >
                        <Link to={`/courses/${item.id}`}>{item.title}</Link>
                        <AddCourse id={item.id} />
                      </li>
                    ))}
                    {!this.state.courses.length && !this.state.loading && (
                      <li>Nothing Found for {inputValue}</li>
                    )}
                  </ul>
                )}
              </div>
            )}
          </Downshift>
        </div>
      </aside>
    )
  }
}

export default Search
export { SEARCH_COURSES_QUERY }
