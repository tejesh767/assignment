import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import './index.css'; 

class VideoDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: null,
    };
  }

  componentDidMount() {
    this.fetchVideo();
  }

  fetchVideo = async () => {
    const { id } = this.props.match.params;
    try {
      const response = await axios.get(`http://localhost:10000/videos/${id}`);
      this.setState({ video: response.data });
    } catch (error) {
      console.error('Error fetching video', error);
    }
  };

  render() {
    const { video } = this.state;
    if (!video) return <div>Loading...</div>;

    return (
      <div className="video-display-container">
        <h1 className="video-display-heading">{video.title}</h1>
        <p className="video-display-description">{video.description}</p>
        <video className="video-display-video" controls autoPlay>
          <source src={video.video} type="video/mp4" />
        </video>
      </div>
    );
  }
}

export default withRouter(VideoDisplay);
