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
      variables: { searchTerm: e.target.value }
    })
    this.setState({
      courses: res.data.courses,
      loading: false
    })
  }, 300)
  render() {
    return (
      <div>
        <Downshift itemToString={item => (item === null ? '' : item.title)}>
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex
          }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search Department...',
                      id: 'search',
                      className: this.state.loading ? <p>Loading...</p> : '',
                      onChange: e => {
                        e.persist()
                        this.onChange(e, client)
                      }
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <div>
                  {this.state.courses.map((item, index) => (
                    <div
                      {...getItemProps({ item })}
                      key={item.id}
                      highlighted={index === highlightedIndex}
                    >
                      <div>
                        <Link to={`/courses/${item.id}`}>{item.title}</Link>
                      </div>
                      <AddCourse id={item.id} />
                    </div>
                  ))}
                  {!this.state.courses.length && !this.state.loading && (
                    <div>Nothing Found for {inputValue}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </Downshift>
      </div>
    )
  }
}

export default Search
