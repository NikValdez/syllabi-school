import React from 'react'
import styled from 'styled-components'

const NoMatchStyles = styled.div`
  width: 25vw;
  height: 25vh;
  margin-top: 10rem;
  padding-bottom: 40rem;
  h1 {
    text-align: center;
    margin-top: 10rem;
    font-weight: 900;
  }
  h2 {
    font-weight: 900;
  }
  margin: 0 auto;
`

const NoMatch = ({ location }) => (
  <NoMatchStyles>
    <h1>404</h1>
    <h2>
      Sorry! No page at address <code>{location.pathname}</code>
    </h2>
  </NoMatchStyles>
)

export default NoMatch
