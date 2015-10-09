var React = require('react');

var Search = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    //references to 'input' to find the value of what is being passed into input
    var inputVal = React.findDOMNode(this.refs.input).value
    //on submit, it sends the prop 'checkClick' with the input value being passed in
    //it passes in the value to the parent songEntry so that they can use that search value
    //to scrape soundcloud API data
    this.props.checkClick(inputVal)
    React.findDOMNode(this.refs.input).value = '';
  },
  render: function() {
   return (
      <div className='searchbar-container'>
        <div className='searchbar'>
          <form onSubmit={this.handleSubmit}>
            <input type='text' onSubmit={this.props.checkClick} ref='input'/>
          </form>
        </div>
      </div>
    )
  }
});

module.exports = Search;