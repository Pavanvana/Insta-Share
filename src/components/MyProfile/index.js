import './index.css'

import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import MyProfileDetails from '../MyProfileDetails'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class MyProfile extends Component {
  state = {
    myProfileData: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getMyProfileData()
  }

  getMyProfileData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/my-profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const fetchedData = await response.json()
    const data = fetchedData.profile
    if (response.ok) {
      const updatedData = {
        followersCount: data.followers_count,
        followingCount: data.following_count,
        id: data.id,
        posts: data.posts.map(eachPost => ({
          id: eachPost.id,
          image: eachPost.image,
        })),
        postsCount: data.posts_count,
        profilePic: data.profile_pic,
        stories: data.stories.map(eachStory => ({
          id: eachStory.id,
          image: eachStory.image,
        })),
        userBio: data.user_bio,
        userId: data.user_id,
        userName: data.user_name,
      }
      this.setState({
        myProfileData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRenderSuccessView = () => {
    const {myProfileData} = this.state
    return (
      <ul>
        <MyProfileDetails profileDetails={myProfileData} my="my" />
      </ul>
    )
  }

  onClickTryAgain = () => {
    this.getMyProfileData()
  }

  renderFailureView = () => (
    <div className="failureView-container">
      <img
        src="https://res.cloudinary.com/daflxmokq/image/upload/v1677168503/Group_7522_eu9zld.png"
        alt="failure view"
        className="failure-img"
      />
      <p className="failure-msg">Something went wrong. Please try again</p>
      <button
        className="try-again-btn"
        type="button"
        onClick={this.onClickTryAgain}
      >
        Try again
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderApiViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onRenderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderApiViews()}</div>
      </>
    )
  }
}

export default MyProfile
