import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { endpoint } from './config'
import ApolloClient from 'apollo-boost'
import Courses from './components/Courses'
import CreateCourse from './components/CreateCourse'
import UpdateCourse from './components/UpdateCourse'
import CreateEvent from './components/CreateEvent'
import SingleCourse from './components/SingleCourse'
import Container from './components/styles/Container'
import Header from './components/Header'
import Signup from './components/Signup'
import Signin from './components/Signin'
import RequestReset from './components/RequestReset'
import Reset from './components/Reset'
import Permissions from './components/Permissions'
import PleaseSignIn from './components/PleaseSignIn'
import SchedulePDF from './components/SchedulePDF'
import CreateAnnouncement from './components/CreateAnnouncement'
import './App.css'

const client = new ApolloClient({
  uri: endpoint,
  credentials: 'include'
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <Container>
            <Header />
            <Switch>
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/signin" component={Signin} />
              <Route path="/request_reset" component={RequestReset} />
              <Route path="/reset/:resetToken" component={Reset} />
              <PleaseSignIn>
                <Route exact path="/" component={Courses} />
                <Route path="/courses/:id" component={SingleCourse} />
                <Route path="/update/:id" component={UpdateCourse} />
                <Route path="/create_course" component={CreateCourse} />
                <Route path="/create_event" component={CreateEvent} />
                <Route path="/permissions" component={Permissions} />
                <Route path="/schedule" component={SchedulePDF} />
                <Route
                  path="/create_announcement"
                  component={CreateAnnouncement}
                />
              </PleaseSignIn>
            </Switch>
          </Container>
        </Router>
      </ApolloProvider>
    )
  }
}

export default App
