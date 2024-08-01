import React, { Component, createRef } from 'react';
import axios from 'axios';
import './index.css';
import { GoArrowRight } from "react-icons/go";
import { Link } from 'react-router-dom';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      thumbnail: null,
      video: null,
      message: '',
      successMessage: '',
      uploading: false  
    };

    this.thumbnailInput = createRef();
    this.videoInput = createRef();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleFileChange(event) {
    const { name, files } = event.target;
    this.setState({ [name]: files[0] });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', this.state.title);
    formData.append('description', this.state.description);
    formData.append('thumbnail', this.state.thumbnail);
    formData.append('video', this.state.video);

    this.setState({ uploading: true });  

    try {
      const response = await axios.post('http://localhost:10000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      this.setState({ 
        message: response.data.message,
        successMessage: 'Uploaded successfully!',
        title: '',
        description: '',
        thumbnail: null,
        video: null,
        uploading: false  
      });
 
      this.thumbnailInput.current.value = '';
      this.videoInput.current.value = '';

       
      setTimeout(() => {
        this.setState({ successMessage: '' });
      }, 3000);

    } catch (error) {
      console.error('Error uploading', error);
      this.setState({ 
        message: `Upload failed: ${error.response ? error.response.data.message : error.message}`,
        uploading: false  
      });
    }
  }

  render() {
    return (
      <div className="upload-container">
        <Link className='react-icon' to="/Listing"><p className='icon'>Video Listings</p>
       <GoArrowRight className='arrow' />
       </Link>
        
        <h1 className="upload-heading">Upload Video</h1>
        <form className="upload-form" onSubmit={this.handleSubmit}>
          <div>
            <label className="upload-label">Title:</label>
            <input
              className="upload-input"
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleInputChange}
              maxLength="50"
            />
          </div>
          <div>
            <label className="upload-label">Description:</label>
            <textarea
              className="upload-textarea"
              name="description"
              value={this.state.description}
              onChange={this.handleInputChange}
              maxLength="200"
            />
          </div>
          <div>
            <label className="upload-label">Thumbnail:</label>
            <input
              className="upload-input"
              type="file"
              name="thumbnail"
              onChange={this.handleFileChange}
              ref={this.thumbnailInput}
            />
          </div>
          <div>
            <label className="upload-label">Video:</label>
            <input
              className="upload-input"
              type="file"
              name="video"
              onChange={this.handleFileChange}
              ref={this.videoInput}
            />
          </div>
          <button className="upload-button" type="submit">Upload</button>
        </form>
        {this.state.uploading && <p className="uploading">Uploading...</p>} {}
        {this.state.message && <p className="upload-message">{this.state.message}</p>}
        {this.state.successMessage && <p className="upload-success">{this.state.successMessage}</p>}
      </div>
    );
  }
}

export default Upload;
