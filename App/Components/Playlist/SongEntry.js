var React = require('react');
var Search = require('./Search');
var Song = require('./Song');
var Player = require('./Player');
var Firebase = require('firebase');


var SongEntry = React.createClass({
  // This function fetches the right playlist from Firebase based on
  // your playlist code.
  loadSongsFromServer: function(receivedCode) {
    this.firebaseRef = new Firebase('https://lldj.firebaseio.com/' + receivedCode + '/playlist');

    this.firebaseRef.on('child_added', function(snapshot) {
      var eachSong = snapshot.val()
      var eachTitle = eachSong.title;
      var artist = eachTitle.slice(0, eachTitle.indexOf('-'));
      var song = eachTitle.slice(eachTitle.indexOf('-')+1, eachTitle.length)
      // Pushes each song into the items array for rendering
      var found = false;
      for (var i = 0; i < this.items.length; i++){
        if(this.items[i].songUrl === eachSong.songUrl){
          found = true;
        }
      }
      if(!found){
        this.items.push({
          key: this.items.length,
          artist: artist,
          song: song,
          songUrl: eachSong.songUrl
        });
        this.setState({songs: this.items});
      }
    }.bind(this));
  },
  // This rerenders the playlist every time a song is removed from Firebase
  rerenderPlaylist: function() {
    this.firebaseRef.on('child_removed', function(snapshot) {
      var removeSongbyUrl = snapshot.val().songUrl;
      var isFound = false;
      // Loops through the songs array and removes the deleted song
      // from firebase to control rendering for react
      for(var i = 0; i < this.state.songs.length; i++) {
        if(this.state.songs[i].songUrl === removeSongbyUrl && !isFound) {
          this.state.songs.splice(i,1)
          isFound = true;
        }
      }
      // Resets the state to accurately reflect removed items
      this.setState({
        songs: this.state.songs
      });
      this.forceUpdate();
    }.bind(this));
  },
  // Sets the initial playlist code to an empty string
  getDefaultProps: function() {
    return {
      playlistCode: ''
    }
  },
  getInitialState: function(){
    this.items = [];
    return {
      songs: [],
      active: false,
      input: '',
      searchResults: [],
      toggle: false,
      hasToken: false
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.state.hasToken = nextProps.hasToken;
    var receivedCode = nextProps.playlistCode;
    this.loadSongsFromServer(receivedCode);
    this.rerenderPlaylist();
  },
  handleSearchInput: function(inputSearch) {
    this.setState({
      input: inputSearch
    });
    this.toggleBox();
    this.soundCloudCall(inputSearch);
  },
  toggleBox: function() {
    this.setState({
      active: !this.state.active
    })
  },
  // This function adds songs to firebase
  pushSong: function(e) {
    var selectedSong = e.target.childNodes[0].data;
    var allResults = this.state.searchResults;

    for(var i = 0; i < allResults.length; i++) {
      if(allResults[i].title === selectedSong) {
        this.firebaseRef.push({
          title: allResults[i].title,
          songUrl: allResults[i].songUrl
        });
      }
    }
   this.toggleBox();
   e.preventDefault();
  },
  // Controls the play and pause functionality of the music player
  playPause: function() {
    var fbref = this.firebaseRef;
    var songs = this.state.songs;
    var player = this;

    var myOptions = {
      onload : function() {
        var duration = this.duration;
      },
      onfinish : function() {
        // Delete first song from firebase
        var children = [];
        var oldUrl = this.url.slice(0, this.url.indexOf('/stream'));
        fbref.once('value', function(snapshot){
          snapshot.forEach(function(childSnapshot){
            //console.log('childSnap: ', childSnapshot.val());
            children.push(childSnapshot.val().songUrl);
          });
        });
        // fbref.child(children[0]).remove();
        // Play firstSong
        if(player.state.songs.length){
          for(var i = 0; i < player.state.songs.length - 1; i++){
            if(player.state.songs[i].songUrl === oldUrl && player.state.songs[i+1]){
              SC.stream(player.state.songs[i+1].songUrl, myOptions, function(song) {
                song.play();
              });  
            }
          }
          window.soundManager.pauseAll();
        }
      }
    }
    // If there's no current soundManager object, create one
    if(!window.soundManager){
      SC.stream(player.state.songs[0].songUrl, myOptions, function(song) {
        console.log('song: ', song);
        song.play();
      })
    }else{
      if(this.state.toggle){
        this.setState({
          toggle: false
        });
        window.soundManager.resumeAll();
      }else{
        this.setState({
          toggle: true
        });
        window.soundManager.pauseAll();
      }
    }
  },
  // Controls the searching and displaying of results from the SoundCloud API
  soundCloudCall: function(inputSearch) {
    if(this.state.searchResults.length > 0) {
      this.setState({ searchResults: this.state.searchResults.slice(0) })
      this.forceUpdate();
    } 
    SC.get('https://api.soundcloud.com/tracks/', { q: inputSearch, limit: 7 }, function(tracks) {
    // Display each song title and an option to add '+' to host playlist
      var obj = [];

      for(var i = 0; i < tracks.length; i++) {
        var eachSong = tracks[i].title;
        var eachUrl = tracks[i].uri;
        obj.push({
          title: eachSong,
          songUrl: eachUrl
        });
       }
      this.setState({ 
        searchResults: obj 
      })
   }.bind(this));
  },
  handleDelete: function(e){
    e.preventDefault();
    var fbref = this.firebaseRef;

    fbref.once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().songUrl === e.target.value){
          fbref.child(childSnapshot.key()).remove();
        }
      });
    });
  },
  render: function(){
    var self = this;
    var songStructure = this.state.songs.map(function(song, i) {
      return (
        <Song data={song} key={i} onDelete={self.handleDelete} ref={song.songUrl} />
      )
    })
    var songResults = this.state.searchResults.map(function(song, i) {
      var songUri = song.songUrl
      return <a className='song-results' key={i} href='#' ref='eachSoundcloud' value={songUri}>{song.title}<div className='plus'>+</div></a>
    })
    if(this.state.active) {
      var display = {
        display: 'block'
      }
    } else {
      var display = {
        display: 'none' 
      }
    }
    return (
      <div>
       {this.state.hasToken ? <Player togglePlayer={this.playPause}/> : null}
        <Search checkClick={this.handleSearchInput}/>
        <div className='soundcloud-results' style={display}>
          <div className='song-results' onClick={this.pushSong}>
            {songResults}
          </div>
        </div>
       {songStructure}
      </div>
    );
   },
  componentDidMount: function() {
    var jwt = window.localStorage.getItem('token');
    if (this.props.playlistCode.length > 0 && !jwt) {
      this.loadSongsFromServer(this.props.playlistCode);
      this.rerenderPlaylist();
    }
  }
});

module.exports = SongEntry;
