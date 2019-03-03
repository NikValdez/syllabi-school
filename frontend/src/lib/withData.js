import ApolloClient from 'apollo-boost'

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.PROD_ENDPOINT,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include'
        },
        headers
      })
    }
  })
}

export default createClient
