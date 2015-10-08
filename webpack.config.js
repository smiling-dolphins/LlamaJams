module.exports = {
  context: __dirname + '/App',
  entry: './Components/Main',
  output: {
    path: __dirname + '/Public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      }
    ]
  }
}