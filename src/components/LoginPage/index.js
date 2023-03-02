import {Component} from 'react'

import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class LoginPage extends Component {
  state = {
    username: '',
    password: '',
    showErrorMsg: false,
    errorMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {usernameInput, passwordInput, showErrorMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="login-and-form-container">
          <img
            src="https://res.cloudinary.com/daflxmokq/image/upload/v1677054537/Layer_2_nphrha.jpg"
            alt="website login"
            className="login-img"
          />
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <img
              src="https://res.cloudinary.com/daflxmokq/image/upload/v1677054771/Standard_Collection_8_zoh239.png"
              alt="website logo"
              className="logo"
            />
            <h1 className="heading">Insta Share</h1>
            <div className="input-container">
              <label className="label" htmlFor="username">
                USERNAME
              </label>
              <input
                className="input"
                type="text"
                id="username"
                placeholder="Username"
                onChange={this.onChangeUsername}
                value={usernameInput}
              />
            </div>
            <div className="input-container">
              <label className="label" htmlFor="password">
                PASSWORD
              </label>
              <input
                className="input"
                type="password"
                id="password"
                placeholder="Password"
                onChange={this.onChangePassword}
                value={passwordInput}
              />
            </div>
            {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}
export default LoginPage
