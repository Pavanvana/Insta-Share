import './index.css'

import {Component} from 'react'
import {FaSearch} from 'react-icons/fa'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import PostItem from '../PostItem'

import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Search extends Component {
  state = {
    postsData: [],
    apiStatus: apiStatusConstants.initial,
    searchInput: '',
  }

  componentDidMount = () => {
    this.onGetPosts()
  }

  postDetails = post => ({
    imageUrl: post.image_url,
    caption: post.caption,
    button: false,
  })

  onGetPosts = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchInput} = this.state
    const url = `https://apis.ccbp.in/insta-share/posts/?search=${searchInput}`
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
    const {postsData, button} = this.state
    return (
      <>
        {postsData.length > 0 ? (
          <ul className="posts-items-container-sm">
            {postsData.map(eachPost => (
              <PostItem key={eachPost.postId} item={eachPost} button={button} />
            ))}
          </ul>
        ) : (
          <div className="not-found-container-sm">
            <img
              src="https://res.cloudinary.com/daflxmokq/image/upload/v1677136867/Group_a31ngd.png"
              alt="search not found"
              className="not-found-img"
            />
            <p className="not-found-heading">Search Not Found</p>
            <p className="not-found-description">
              Try different keyword or search again
            </p>
          </div>
        )}
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

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchInput = () => {
    this.onGetPosts()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.onGetPosts()
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="search-post-container">
          <div className="search-container-sm">
            <input
              type="search"
              placeholder="Search Caption"
              className="search-caption-input"
              onChange={this.onChangeSearchInput}
              value={searchInput}
              onKeyDown={this.onEnterSearchInput}
            />
            <button
              type="button"
              className="search-icon"
              onClick={this.onClickSearchInput}
            >
              <FaSearch size="15" />
            </button>
          </div>
        </div>
        <div className="card">
          <div className="posts-container-sm">
            {this.renderApiPostStatusView()}
          </div>
        </div>
      </>
    )
  }
}
export default Search
