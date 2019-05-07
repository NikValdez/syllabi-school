import gql from 'graphql-tag'
import moment from 'moment'
import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import ReactHtmlParser from 'react-html-parser'
import ReactModal from 'react-modal'
import styled, { keyframes } from 'styled-components'
import './styles/Modal.css'
import { TableStyles, TdStyles, ThStyles, TrStyles } from './styles/Table'
import { Dropdown } from 'react-bootstrap'

const stretch = keyframes`
  0% {
    transform: scale(.3);
    background-color: black;
    border-radius: 100%;
  }

   100% {
    transform: scale(.5);
    background-color: #fffcdf;
    border-radius: 100%;
  }
`
const Alert = styled.div`
  width: 50px;
  margin: 0 auto;
  background-color: #fffcdf;
  animation-name: ${stretch};
  animation-duration: 1.5s;
  animation-timing-function: ease-out;
  animation-delay: 0;
  animation-direction: alternate;
  animation-iteration-count: infinite;
  animation-fill-mode: none;
  animation-play-state: running;
  font-size: 30px;
  .element {
    margin-bottom: 20px;
  }

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
              {/* {count.length > 0 && (
                    <Alert className="element">{count.length} </Alert>
                  )} */}
              <Dropdown onToggle={this.toggle}>
                <Dropdown.Toggle id="dropdown-annonucements">
                  <i
                    className="far fa-flag"
                    style={{
                      color: count.length > 0 ? '#ec38bc' : '#ffffffa3',
                      fontSize: count.length > 0 ? '1.5em' : '1.3em',
                      marginBottom: '1.5rem',
                      marginRight: '1rem'
                    }}
                  />

                  <Dropdown.Menu id="dropdown-announcement-items">
                    <>
                      {announcements.length < 1 ? (
                        <p style={{ background: '#fffcdf' }}>
                          No Announcements Currently
                        </p>
                      ) : (
                        <TableStyles style={{ border: '1px solid black' }}>
                          <tbody style={{ background: 'black' }}>
                            <tr>
                              <ThStyles style={{ color: 'white' }}>
                                Date
                              </ThStyles>
                              <ThStyles style={{ color: 'white' }}>
                                Announcement
                              </ThStyles>
                              <ThStyles style={{ color: 'white' }}>
                                Seen
                              </ThStyles>
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
                                    <TrStyles key={id}>
                                      <TdStyles
                                        style={{
                                          color: course.color,
                                          marginBottom: '1rem'
                                        }}
                                      >
                                        {moment(date).format('MMM Do YYYY')}
                                      </TdStyles>
                                      <TdStyles
                                        style={{
                                          color: 'white'
                                          // background: course.color
                                        }}
                                      >
                                        {ReactHtmlParser(text)}
                                      </TdStyles>

                                      <TdStyles style={{ color: 'white' }}>
                                        <div
                                          onClick={() => {
                                            updateAnnouncement()
                                          }}
                                        >
                                          {clicked ? (
                                            <span
                                              role="img"
                                              style={{
                                                marginLeft: '10px'
                                              }}
                                            >
                                              ❌
                                            </span>
                                          ) : (
                                            <span
                                              style={{
                                                marginLeft: '10px'
                                              }}
                                            >
                                              ☑️
                                            </span>
                                          )}
                                        </div>
                                      </TdStyles>
                                    </TrStyles>
                                  )}
                                </Mutation>
                              )
                            )}
                          </tbody>
                        </TableStyles>
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
