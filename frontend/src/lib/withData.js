import ApolloClient from 'apollo-boost'
import { prodEndpoint } from '../config'

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? prodEndpoint : prodEndpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include'
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
  })
}

export default createClient
