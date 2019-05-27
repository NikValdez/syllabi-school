import gql from 'graphql-tag'
import moment from 'moment'
import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import { Dropdown } from 'react-bootstrap'
import ReactHtmlParser from 'react-html-parser'

const ANNOUNCEMENTS_QUERY = gql`
  query {
    me {
      id
      announcements {
        id
        date
        clicked
        text
        course {
          color
        }
      }
    }
  }
`

const UPDATE_ANNOUNCEMENT_MUTATION = gql`
  mutation UPDATE_ANNOUNCEMENT_MUTATION($id: ID!, $clicked: Boolean) {
    updateAnnouncement(id: $id, clicked: $clicked) {
      id
      clicked
    }
  }
`

class Announcements extends Component {
  state = {
    // showModal: false,
    isOpen: false
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    return (
      <Query query={ANNOUNCEMENTS_QUERY}>
        {({ error, loading, data }) => {
          if (error) return <p>Error</p>
          if (loading) return <p>Loading...</p>
          if (!data.me.announcements) return <p>No Announcements</p>
          // const me = data ? data.me : null
          const announcements = data
            ? data.me.announcements
                .sort((a, b) => {
                  return new Date(a.date).getTime() - new Date(b.date).getTime()
                })
                .reverse()
            : null

          //get current count for number of announcements
          const count = announcements
            .map(announcement => {
              if (announcement.clicked === true) {
                return +1
              }
            })
            .filter(Boolean)

          return (
            <div>
              <Dropdown onToggle={this.toggle}>
                <Dropdown.Toggle id="dropdown-annonucements">
                  <i className="far fa-flag" />

                  <Dropdown.Menu id="dropdown-announcement-items">
                    <>
                      {announcements.length < 1 ? (
                        <p>No Announcements Currently</p>
                      ) : (
                        <table>
                          <tbody>
                            <tr>
                              <th>Date</th>
                              <th>Announcement</th>
                              <th>Seen</th>
                            </tr>

                            {announcements.map(
                              ({ text, date, id, clicked, course }) => (
                                <Mutation
                                  mutation={UPDATE_ANNOUNCEMENT_MUTATION}
                                  variables={{
                                    id: id,
                                    clicked: false
                                  }}
                                  key={id}
                                >
                                  {(updateAnnouncement, { loading, error }) => (
                                    <tr key={id}>
                                      <td>
                                        <p>
                                          {moment(date).format('MMM Do YYYY')}
                                        </p>
                                      </td>
                                      <td>{ReactHtmlParser(text)}</td>

                                      <td>
                                        <div
                                          onClick={() => {
                                            updateAnnouncement()
                                          }}
                                        >
                                          {clicked ? (
                                            <span role="img">
                                              <p>❌</p>
                                            </span>
                                          ) : (
                                            <span>
                                              <p>☑️</p>
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </Mutation>
                              )
                            )}
                          </tbody>
                        </table>
                      )}
                    </>
                  </Dropdown.Menu>
                </Dropdown.Toggle>
              </Dropdown>
            </div>
          )
        }}
      </Query>
    )
  }
}

export default Announcements
export { ANNOUNCEMENTS_QUERY }
