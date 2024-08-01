import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './index.css';  
class Listing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
    };
  }

  componentDidMount() {
    this.fetchVideos();
  }

  fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/videos');
      this.setState({ videos: response.data });
    } catch (error) {
      console.error('Error fetching videos', error);
    }
  };

  render() {
    const { videos } = this.state;
    return (
      <div className="listing-container">
        <h1 className="listing-heading">Video Listings</h1>
        <ul className="video-list">
          {videos.map((video) => (
            <li key={video.id}>
              <Link to={`/videos/${video.id}`}>
                <img src={video.thumbnail} alt={video.title} width="120" />
                <h2>{video.title}</h2>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Listing;
