import React, { Component } from 'react'
import Downshift from 'downshift'
import { ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown'
import { Link } from 'react-router-dom'

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
  }, 350)
  render() {
    return (
      <SearchStyles>
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
                    type="search"
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search for a Course...',
                      id: 'search',
                      className: this.state.loading ? 'loading' : '',
                      onChange: e => {
                        e.persist()
                        this.onChange(e, client)
                      }
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {this.state.courses.map((item, index) => (
                    <DropDownItem
                      {...getItemProps({ item })}
                      key={item.id}
                      highlightedIndex={index === highlightedIndex}
                    >
                      <Link to={`/courses/${item.id}`}>{item.title}</Link>
                    </DropDownItem>
                  ))}
                  {!this.state.courses.length && !this.state.loading && (
                    <DropDownItem>Nothing Found for {inputValue}</DropDownItem>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    )
  }
}

export default Search
