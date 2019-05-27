import PropTypes from 'prop-types'
import React from 'react'

const ErrorMessage = ({ error }) => {
  if (!error || !error.message) return null
  if (
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors.length
  ) {
    return error.networkError.result.errors.map((error, i) => (
      <div key={i}>
        <p data-test="graphql-error">
          <strong>Sorry!</strong>
          {error.message.replace('GraphQL error: ', '')}
        </p>
      </div>
    ))
  }
  return (
    <div>
      <p data-test="graphql-error">
        <strong>Sorry!</strong>
        {error.message.replace('GraphQL error: ', '')}
      </p>
    </div>
  )
}

ErrorMessage.defaultProps = {
  error: {}
}

ErrorMessage.propTypes = {
  error: PropTypes.object
}

export default ErrorMessage
