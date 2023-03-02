import './index.css'

import {Link} from 'react-router-dom'

const NotFound = () => (
  <>
    <div className="not-found-container">
      <div className="not-found-image-container">
        <img
          className="not-found-image"
          src="https://res.cloudinary.com/daflxmokq/image/upload/v1677175325/erroring_1_fpnn65.png"
          alt="page not found"
        />
      </div>
      <h1 className="not-found-heading">Page Not Found</h1>
      <p className="not-found-paragraph">
        We are sorry, the page you requested could not be found.
        <br />
        Please go back to the homepage.
      </p>
      <Link to="/">
        <button type="button" className="home-page-btn">
          Home Page
        </button>
      </Link>
    </div>
  </>
)

export default NotFound
