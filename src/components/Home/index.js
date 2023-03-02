import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Stories from '../Stories'

import './index.css'
import PostsList from '../PostsList'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    searchInput: '',
    storiesView: true,
    postsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.onGetPosts()
  }

  postDetails = post => ({
    imageUrl: post.image_url,
    caption: post.caption,
  })

  onGetPosts = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = `https://apis.ccbp.in/insta-share/posts/`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.posts.map(eachPost => ({
        userName: eachPost.user_name,
        userId: eachPost.user_id,
        profilePic: eachPost.profile_pic,
        postId: eachPost.post_id,
        likesCount: eachPost.likes_count,
        createdAt: eachPost.created_at,
        comments: eachPost.comments.map(eachComment => ({
          comment: eachComment.comment,
          userId: eachComment.user_id,
          userName: eachComment.user_name,
        })),
        postDetails: this.postDetails(eachPost.post_details),
      }))
      this.setState({
        postsData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {searchInput, postsData} = this.state
    return (
      <>
        <PostsList postsData={postsData} searchInput={searchInput} />
      </>
    )
  }

  onClickReTry = () => {
    this.onGetPosts()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/daflxmokq/image/upload/v1677128965/alert-triangle_yavvbl.png"
        alt="failure view"
        className="failure view"
      />
      <p className="alert-msg">Something went wrong. Please try again</p>
      <button
        className="tryagain-btn"
        type="button"
        onClick={this.onClickReTry}
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

  changeSearchInput = value => {
    this.setState({searchInput: value, storiesView: false}, this.onGetPosts)
  }

  renderApiPostStatusView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {storiesView} = this.state
    return (
      <>
        <Header changeSearchInput={this.changeSearchInput} />
        <div className="home-container">
          {storiesView && (
            <div className="stories-container">
              <Stories />
            </div>
          )}
          {!storiesView && (
            <h1 className="search-result-heading">Search Results</h1>
          )}
          <div className="posts-container">
            {this.renderApiPostStatusView()}
          </div>
        </div>
      </>
    )
  }
}
export default Home
