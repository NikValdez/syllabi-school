import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { TableStyles, TdStyles, ThStyles, TrStyles } from './styles/Table'
import moment from 'moment'
import htmlToText from 'html-to-text'
import styled from 'styled-components'
import { keyframes } from 'styled-components'

const stretch = keyframes`
  0% {
    transform: scale(.3);
    background-color: #7d5f05;
    border-radius: 100%;
  }

   100% {
    transform: scale(.5);
    background-color: #f9c321;
    border-radius: 100%;
  }
`
const Alert = styled.div`
  height: 50px;
  width: 50px;
  margin: 0 auto;
  background-color: #f9c321;
  animation-name: ${stretch};
  animation-duration: 1.5s;
  animation-timing-function: ease-out;
  animation-delay: 0;
  animation-direction: alternate;
  animation-iteration-count: infinite;
  animation-fill-mode: none;
  animation-play-state: running;
  font-size: 30px;
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
`

const ANNOUNCEMENTS_QUERY = gql`
  query {
    me {
      id
      announcements {
        id
        date
        clicked
        text
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
    displayMenu: false
  }

  showDropdownMenu = e => {
    e.preventDefault()
    this.setState({ displayMenu: true }, () => {
      document.addEventListener('click', this.hideDropdownMenu)
    })
  }

  hideDropdownMenu = () => {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener('click', this.hideDropdownMenu)
    })
  }

  render() {
    return (
      <Query query={ANNOUNCEMENTS_QUERY}>
        {({ error, loading, data }) => {
          console.log(data)
          if (error) return <p>Error</p>
          if (loading) return <p>Loading...</p>
          if (!data.me.announcements) return <p>No Announcements</p>
          const announcements = data.me.announcements
            .sort((a, b) => {
              return new Date(a.date).getTime() - new Date(b.date).getTime()
            })
            .reverse()

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
              {count.length > 0 && (
                <Alert className="element">{count.length}</Alert>
              )}

              <div
                className="dropdown"
                style={{
                  width: '600px',
                  height: '400px',
                  position: 'absolute',
                  right: '2rem',
                  zIndex: '999'
                }}
              >
                <div
                  className="button"
                  onClick={this.showDropdownMenu}
                  style={{
                    position: 'absolute',
                    right: '-1.3rem',
                    top: '-1rem'
                  }}
                >
                  🔔
                </div>
                {this.state.displayMenu ? (
                  <>
                    {announcements.length < 1 ? (
                      <p>No Announcements Currently</p>
                    ) : (
                      <TableStyles
                        style={{ border: '1px solid black', height: '400px' }}
                      >
                        <tbody style={{ background: 'black' }}>
                          <tr>
                            <ThStyles style={{ color: 'white' }}>
                              Announcement
                            </ThStyles>
                            <ThStyles style={{ color: 'white' }}>Date</ThStyles>
                            <ThStyles style={{ color: 'white' }}>Seen</ThStyles>
                          </tr>

                          {announcements.map(({ text, date, id, clicked }) => (
                            <Mutation
                              mutation={UPDATE_ANNOUNCEMENT_MUTATION}
                              variables={{
                                id: id,
                                clicked: false
                              }}
                              key={id}
                            >
                              {(updateAnnouncement, { loading, error }) => (
                                <TrStyles key={id}>
                                  <TdStyles style={{ color: 'white' }}>
                                    {htmlToText.fromString(text)}
                                  </TdStyles>
                                  <TdStyles style={{ color: 'white' }}>
                                    {moment(date).format('MMM Do YYYY')}
                                  </TdStyles>
                                  <TdStyles style={{ color: 'white' }}>
                                    <div
                                      onClick={() => {
                                        updateAnnouncement()
                                      }}
                                    >
                                      {clicked ? (
                                        <span style={{ marginLeft: '10px' }}>
                                          ❌
                                        </span>
                                      ) : (
                                        <span style={{ marginLeft: '10px' }}>
                                          ☑️
                                        </span>
                                      )}
                                    </div>
                                  </TdStyles>
                                </TrStyles>
                              )}
                            </Mutation>
                          ))}
                        </tbody>
                      </TableStyles>
                    )}
                  </>
                ) : null}
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
