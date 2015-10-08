var React = require('react');
var Auth = require('./auth/auth');
var Playlist = require('./playlist/playlist');
var helpers = require('../utils/helpers');

var Main = React.createClass({

  getInitialState: function() {

    return {
      showAuth: true,
      showPlaylist: false,
      playlistCode: '',
      check: false,
      hasToken: false,
      backgroundColor: '#d0c490'
    };
  },

  // function to check which component (playlist or auth) should be rendered
  showInput: function(){
    // retrieve token from local storage
    var jwt = window.localStorage.getItem('token');
    // if token exists, take user to playlist
    if (jwt) {
      // change trigger state
      this.setState({hasToken: true, showAuth: false, showPlaylist: true});
      // save context in variable
      var self = this;

      // authenticate token
      helpers.authHost(jwt)
        .then(function(data) {
          // save playlist code as state, to be transferred down to children component as property
          self.setState({playlistCode: data.auth.playlistCode});
        })
        .catch(function(err) {
          console.log(err);
        })

    } else {
      console.log('NO TOKEN FOUND');
      var self = this;
      var playlistCode = this.state.playlistCode;
      helpers.checkCode()
      .then(function(snapshot) {
        // iterate through array of playlists(objects)
        for (var code in snapshot.val()) {
          // if it matches the playlist code, render playlist view
          if (code === playlistCode) {
          self.setState({check: false, showAuth: false, showPlaylist: true});
          } 
        }
      });
    }
  },

  updateCode: function(newCode) {
    // change playlist code and re-render main component
    this.setState({playlistCode: newCode}, function() {
      this.showInput();
    });
  },

  componentWillMount: function() {
    this.showInput();
    $('body').css('background-color', this.state.backgroundColor);
  },

// render is in ternary conditional statements ("if the state is true, show element (playlist or auth)")
  render: function() {
    return (
      <div className='home-page'>
        <div className='bigger-container'>
        <div className='align-container'>
        <div>
          {this.state.showAuth  ? <Auth updateCode={this.updateCode}/> : null}
        </div>

        <div>
          {this.state.showPlaylist ? <Playlist hasToken={this.state.hasToken} playlistCode={this.state.playlistCode}/> : null}
        </div>        
        </div>
      </div>
      </div>
    )
  }
});

React.render(<Main />, document.getElementById('app'));
