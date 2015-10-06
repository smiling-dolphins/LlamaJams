var React = require('react');
var SongEntry = require('./SongEntry');

//basic playlist skeleton for each page
var Playlist = React.createClass({

//logout clears the local storage so that the user is able to redirect to the home and recreate the page
  logout: function() {
    localStorage.clear();
    location.reload();
  },

  //background color is a state so that it could be used for changing the css when it renders
  getInitialState: function() {
    return {
      backgroundColor: '#34344d'
    }
  },

  //uses jQuery to set the background-color according to which page you're on
  componentWillMount: function() {
    $('body').css('background-color', this.state.backgroundColor);
  },

  render: function() {
    return (
      <div className='music-page'>
        <div className='playlistcode-container'>
          <span className='guestcode-span'>
            GuestCode: {this.props.playlistCode}
          </span>
          <button onClick={this.logout} className='logout-button'>
            LEAVE PLAYLIST
          </button>
        </div>
        <div className='bigger-container'>
        //passes in all the child props to songEntry, the parent
          <SongEntry {...this.props}/>
        </div>
      </div>
    );
  }
});

module.exports = Playlist;
