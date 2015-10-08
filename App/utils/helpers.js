var Firebase = require('firebase');
var FirebaseTokenGenerator = require('firebase-token-generator');
var Promise = require('bluebird');
var Fireproof = require('fireproof');
    Fireproof.bless(Promise);

// create reference to database
var ref = new Firebase('https://lldj.firebaseio.com/')
// 'promisable' reference
var fpRef = new Fireproof(ref);

// use database secret for token generator
var tokenGenerator = new FirebaseTokenGenerator('b8qI3z2xL8Lp1xaq3m3vNNWtpZz1iwBEtSRKXzRx');


module.exports = {
 
  // RETURNING HOST
  authHost: function(token) {
    // authenticate with token
    return fpRef.authWithCustomToken(token);
  },

  // NEW HOST
  createPlaylist: function(firstName) {
    // create playlist code
    var playlistCode = firstName + Math.floor(Math.random()*100);

    // create token with random uid string (not important, just need it to create a token)
		var token = tokenGenerator.createToken({"uid": "asfass23j4io32e23in", "playlistCode": playlistCode});

    // store token
		window.localStorage.setItem('token', token);

		var refactored = {
			token: token,
			playlist: 'playlist',
			playlistCode: playlistCode
		};
		
		var playlistRef = new Firebase("https://lldj.firebaseio.com/" + playlistCode);

    // set the refactored data in database with playlistCode as item name
    playlistRef.set(refactored);

    return playlistCode;
	},

  // GUESTS
  checkCode: function() {
    // return a 'promisable' snaoshot of firebase data
    return fpRef.once('value');
  }
}

