import ApolloClient from 'apollo-boost'
import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Courses from './components/Courses'
import CreateAnnouncement from './components/CreateAnnouncement'
import CreateCourse from './components/CreateCourse'
import CreateEvent from './components/CreateEvent'
import CreateInstitution from './components/CreateInstitution'
import Footer from './components/Footer'
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
import GlobalStyles from './components/styles/GlobalStyles'
import TestTable from './components/TestTable'
import UpdateCourse from './components/UpdateCourse'
import UpdateEvent from './components/UpdateEvent'
import { endpoint } from './config'

// const theme = {
//   red: '#FF0000',
//   black: '#393939',
//   grey: '#3A3A3A',
//   lightgrey: '#E1E1E1',
//   offWhite: '#EDEDED',
//   maxWidth: '1000px',
//   bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)'
// }

const client = new ApolloClient({
  uri: endpoint,
  credentials: 'include'
})

const PermissionsContainer = () => (
  <PleaseSignIn>
    <Route exact path="/permissions" component={Permissions} />
  </PleaseSignIn>
)

const DefaultContainer = () => (
  <>
    <Route exact path="/signup" component={Signup} />
    <Route exact path="/signin" component={Signin} />
    <Route path="/request_reset" component={RequestReset} />
    <Route path="/reset/:resetToken" component={Reset} />
    <PleaseSignIn>
      <Header />
      <Container>
        <Route exact path="/test_table" component={TestTable} />
        <Route exact path="/" component={Courses} />
        <Route path="/courses/:id" component={SingleCourse} />
        <Route path="/create_institution" component={CreateInstitution} />
        <Route path="/create_course" component={CreateCourse} />
        <Route path="/update/:id" component={UpdateCourse} />
        <Route path="/update_event/:id" component={UpdateEvent} />
        <Route path="/create_event" component={CreateEvent} />
        <Route exact path="/permissions" component={Permissions} />
        <Route path="/schedule" component={SchedulePDF} />
        <Route path="/permissions" component={Permissions} />
        <Route path="/create_announcement" component={CreateAnnouncement} />
      </Container>
      <Footer />
    </PleaseSignIn>
  </>
)

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <>
            <GlobalStyles />
            <Switch>
              <Route
                exact
                path="/permissions"
                component={PermissionsContainer}
              />
              <Route component={DefaultContainer} />
            </Switch>
          </>
        </Router>
      </ApolloProvider>
    )
  }
}

export default App
