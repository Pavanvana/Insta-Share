import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Stories extends Component {
  state = {
    storiesData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getStories()
  }

  getStories = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.users_stories.map(eachStory => ({
        storyUrl: eachStory.story_url,
        userId: eachStory.user_id,
        userName: eachStory.user_name,
      }))
      this.setState({
        storiesData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onGetSuccessView = () => {
    const {storiesData} = this.state
    const settings = {
      dots: false,
      slidesToShow: 8,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
      ],
    }

    return (
      <Slider {...settings}>
        {storiesData.map(eachStory => {
          const {userId, storyUrl, userName} = eachStory
          return (
            <li className="slick-item" key={userId}>
              <img className="logo-image" src={storyUrl} alt="user story" />
              <p className="story-user-name">{userName}</p>
            </li>
          )
        })}
      </Slider>
    )
  }

  onGetLoadingView = () => (
    <div className="loader-container1" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={30} width={30} />
    </div>
  )

  onRetry = () => {
    this.setState({apiStatus: apiStatusConstants.inProgress}, this.getStories)
  }

  onGetFailureView = () => (
    <div className="failure-view">
      <img
        src="https://res.cloudinary.com/dq7imhrvo/image/upload/v1643651534/insta%20Shere%20clone/alert-triangle_hczx0o.png"
        alt="failure view"
        className="failure-img"
      />
      <p className="failure-head">Something went wrong. Please try again</p>
      <button className="failure-button" type="button" onClick={this.onRetry}>
        Try again
      </button>
    </div>
  )

  renderStoriesView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onGetSuccessView()
      case apiStatusConstants.inProgress:
        return this.onGetLoadingView()
      case apiStatusConstants.failure:
        return this.onGetFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <ul>{this.renderStoriesView()}</ul>
      </>
    )
  }
}
export default Stories
