import React from 'react'

const NoMatch = ({ location }) => (
  <div>
    <h1>404</h1>
    <h2>
      Sorry! No page at address <code>{location.pathname}</code>
    </h2>
  </div>
)

export default NoMatch
