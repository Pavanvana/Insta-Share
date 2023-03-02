import {Switch, Route, Redirect} from 'react-router-dom'

import LoginPage from './components/LoginPage'
import Home from './components/Home'
import MyProfile from './components/MyProfile'
import Search from './components/Search'
import UserProfile from './components/UserProfile'
import NotFound from './components/NotFound'

import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginPage} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/my-profile" component={MyProfile} />
    <ProtectedRoute exact path="/search" component={Search} />
    <ProtectedRoute exact path="/users/:userId" component={UserProfile} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="not-found" />
  </Switch>
)

export default App
