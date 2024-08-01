import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Upload from './components/Upload';
import Listing from './components/Listing';
import VideoDisplay from './components/VideoDisplay';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/Listing" component={Listing} />
          <Route exact  path="/videos/:id" component={VideoDisplay} />
          <Route exact path="/" component={Upload} />
        </Switch>
      </Router>
    );
  }
}

export default App;
