import gql from 'graphql-tag'
import moment from 'moment'
import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
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

  toggleDropDown = () => {
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
          // const count = announcements
          //   .map(announcement => {
          //     if (announcement.clicked === true) {
          //       return +1
          //     }
          //   })
          //   .filter(Boolean)

          return (
            <div
              className={this.state.isOpen ? 'dropdown is-active' : 'dropdown'}
            >
              {!this.state.isOpen && (
                <button
                  className="button"
                  aria-haspopup="true"
                  aria-controls="dropdown-menu"
                  onClick={this.toggleDropDown}
                >
                  <span>Alerts</span>
                  <span className="icon is-small">
                    <i className="fas fa-angle-down" aria-hidden="true" />
                  </span>
                </button>
              )}
              {this.state.isOpen && (
                <button
                  className="button"
                  aria-haspopup="true"
                  aria-controls="dropdown-menu"
                  onClick={this.toggleDropDown}
                >
                  <span>Close</span>
                  <span className="icon is-small">
                    <i className="fas fa-angle-up" aria-hidden="true" />
                  </span>
                </button>
              )}

              <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <>
                  {announcements.length < 1 ? (
                    <p>No Announcements Currently</p>
                  ) : (
                    <table className="table is-bordered is-fullwidth is-hoverable">
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
                                  <td style={{ background: course.color }}>
                                    <p>{moment(date).format('MMM Do YYYY')}</p>
                                  </td>
                                  <td>{ReactHtmlParser(text)}</td>

                                  <td>
                                    <div
                                      onClick={() => {
                                        updateAnnouncement()
                                      }}
                                    >
                                      {clicked ? (
                                        <span role="img" aria-label="not-seen">
                                          ❌
                                        </span>
                                      ) : (
                                        <span role="img" aria-label="seen">
                                          ☑️
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
              </div>
            </div>
          )
        }}
      </Query>
    )
  }
}

export default Announcements
export { ANNOUNCEMENTS_QUERY }
