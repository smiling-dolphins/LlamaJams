var React = require('react');

{/* KS - make a input type=button here that onClick will call this.props.handleDelete method (not written yet) with param this.props.data.songUrl */}
var DeleteBtn = React.createClass({
  render: function(){
    return (
      <button onClick={this.props.onDelete}>X</button>
    )
  }
});

module.exports = DeleteBtn;

{/* Example of usage:
  var ParentComponent = React.createClass({ // this is SongEntry
      render: function(){
          return (
              <ChildComponent onSomeEvent={this.handleThatEvent} />;
          )
      },
      handleThatEvent: function(e){
           //update state, etc.
      }
  });

  var ChildComponent = React.createClass({ // this is DeleteBtn
      render: function(){
          return (
             <input type="button" onClick={this.props.onSomeEvent} value="Click Me!" />
          )
      }
  });

*/}