import ApolloClient from 'apollo-boost'
import { endpoint, prodEndpoint } from '../config'

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
    request: operation => {
      // operation.setContext({
      //   fetchOptions: {
      //     credentials: 'include'
      //   },
      //   headers
      // })
    }
  })
}

export default createClient
