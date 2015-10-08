var React = require('react');

//the purpose of Song is to render our songs in a uniform way, songEntry uses this structure to render
var Song = React.createClass({
  render: function() {
    return (
      <div className='container-playlist'>
        <div className='song-view'>
          {this.props.data.song}
        </div>
        
        <div className='artist-view'>
          {this.props.data.artist}
        </div>
        <button value={this.props.data.songUrl} onClick={this.props.onDelete}>X</button>
      </div>
    )
  }
})

module.exports = Song;
