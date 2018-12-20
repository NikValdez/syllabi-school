import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { endpoint } from './config'
import ApolloClient from 'apollo-boost'
import Courses from './components/Courses'
import CreateCourse from './components/CreateCourse'
import CreateEvent from './components/CreateEvent'
import SingleCourse from './components/SingleCourse'
import Container from './components/styles/Container'
import Header from './components/Header'
import Signup from './components/Signup'

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
            <Route exact path="/" component={Courses} />
            <Route exact path="/signup" component={Signup} />
            <Route path="/courses/:id" component={SingleCourse} />
            <Route path="/create_course" component={CreateCourse} />
            <Route path="/create_event" component={CreateEvent} />
          </Container>
        </Router>
      </ApolloProvider>
    )
  }
}

export default App
