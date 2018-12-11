import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { endpoint } from './config'
import ApolloClient from 'apollo-boost'
import Courses from './components/Courses'
import Course from './components/Course'
import CreateCourse from './components/CreateCourse'
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
            <Route exact path="/" component={Courses} />
            <Route path="/course/:id" component={Course} />
            <Route path="/create_course" component={CreateCourse} />
          </Container>
        </Router>
      </ApolloProvider>
    )
  }
}

export default App
