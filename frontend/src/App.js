import ApolloClient from 'apollo-boost'
import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import NoMatch from './components/404'
import Courses from './components/Courses'
import CreateAnnouncement from './components/CreateAnnouncement'
import CreateCourse from './components/CreateCourse'
import CreateEvent from './components/CreateEvent'
import CreateInstitution from './components/CreateInstitution'
import Footer from './components/Footer'
import Header from './components/Header'
import Permissions from './components/Permissions'
import PleaseSignIn from './components/PleaseSignIn'
import PrivacyPolicy from './components/PrivacyPolicy'
import RequestReset from './components/RequestReset'
import Reset from './components/Reset'
import Schedule from './components/Schedule'
import Signin from './components/Signin'
import Signup from './components/Signup'
import SingleCourse from './components/SingleCourse'
import Container from './components/styles/Container'
import GlobalStyles from './components/styles/GlobalStyles'
import TermsAndConditions from './components/TermsAndConditions'
import UpdateCourse from './components/UpdateCourse'
import UpdateEvent from './components/UpdateEvent'
import { endpoint } from './config'

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
    <PleaseSignIn>
      <Header />
      <Container>
        <Switch>
          <Route exact path="/" component={Courses} />
          <Route path="/courses/:id" component={SingleCourse} />
          <Route path="/create_institution" component={CreateInstitution} />
          <Route path="/create_course" component={CreateCourse} />
          <Route path="/update/:id" component={UpdateCourse} />
          <Route path="/update_event/:id" component={UpdateEvent} />
          <Route path="/create_event" component={CreateEvent} />
          <Route exact path="/permissions" component={Permissions} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/permissions" component={Permissions} />
          <Route path="/create_announcement" component={CreateAnnouncement} />
          <Route path="/privacy_policy" component={PrivacyPolicy} />
          <Route path="/terms_and_conditions" component={TermsAndConditions} />
          <Route component={NoMatch} />
        </Switch>
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
              <Route exact path="/signin" component={Signin} />
              <Route exact path="/signup" component={Signup} />
              <Route path="/request_reset" component={RequestReset} />
              <Route path="/reset/:resetToken" component={Reset} />
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
