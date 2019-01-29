import ApolloClient from 'apollo-boost'
import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Courses from './components/Courses'
import CreateAnnouncement from './components/CreateAnnouncement'
import CreateCourse from './components/CreateCourse'
import CreateEvent from './components/CreateEvent'
import Header from './components/Header'
import Permissions from './components/Permissions'
import PleaseSignIn from './components/PleaseSignIn'
import RequestReset from './components/RequestReset'
import Reset from './components/Reset'
import SchedulePDF from './components/SchedulePDF'
import Signin from './components/Signin'
import Signup from './components/Signup'
import SingleCourse from './components/SingleCourse'
import Container from './components/styles/Container'
import UpdateCourse from './components/UpdateCourse'
import { endpoint } from './config'

const client = new ApolloClient({
  uri: endpoint,
  credentials: 'include'
})

const PermissionsContainer = () => (
  <Route exact path="/permissions" component={Permissions} />
)

const DefaultContainer = () => (
  <>
    <Header />
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
      <Route path="/schedule" component={SchedulePDF} />
      <Route path="/permissions" component={Permissions} />
      <Route path="/create_announcement" component={CreateAnnouncement} />
    </PleaseSignIn>
  </>
)

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Container>
          <Router>
            <Switch>
              <Route
                exact
                path="/permissions"
                component={PermissionsContainer}
              />
              <Route component={DefaultContainer} />
            </Switch>
          </Router>
        </Container>
      </ApolloProvider>
    )
  }
}

export default App
