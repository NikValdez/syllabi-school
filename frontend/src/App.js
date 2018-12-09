import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { endpoint } from './config'
import ApolloClient from 'apollo-boost'
import Items from './components/Items'
import Item from './components/Item'
import CreateItem from './components/CreateItem'
import Container from './components/styles/Container'
import Header from './components/Header'

import './App.css'

const client = new ApolloClient({
  uri: endpoint
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <Container>
            <Header />
            <Route exact path="/" component={Items} />
            <Route path="/item/:id" component={Item} />
            <Route path="/create" component={CreateItem} />
          </Container>
        </Router>
      </ApolloProvider>
    )
  }
}

export default App
