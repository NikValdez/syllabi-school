import Downshift from 'downshift'
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'
import React, { Component } from 'react'
import { ApolloConsumer } from 'react-apollo'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Book from '../book.gif'
import AddCourse from './AddCourse'
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown'

const LinkStyles = styled.div`
  justify-self: start;
`

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
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search Courses...',
                      id: 'search',
                      className: this.state.loading ? (
                        <img src={Book} alt="Loading" />
                      ) : (
                        ''
                      ),
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
                      highlighted={index === highlightedIndex}
                    >
                      <LinkStyles>
                        <Link to={`/courses/${item.id}`}>{item.title}</Link>
                      </LinkStyles>
                      <AddCourse id={item.id} />
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
