var path = require('path');
var failPlugin = require('webpack-fail-plugin');
var copyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');

var isProduction = process.env.NODE_ENV ? process.env.NODE_ENV.trim() == 'prod' : false;

var config = {
	entry : path.join(__dirname, 'src/js/index.js'),
	output : {
		filename: 'bundle.js',
		path: path.join(__dirname, 'build'),
		sourceMapFilename: 'bundle.map',
	},
	devServer : {
		contentBase: path.join(__dirname, 'build'),
		port: 3000,
	},
	module : {
		rules :[
			{
	      test: /\.jsx?$/,
	      exclude: /node_modules/,
	      loader: 'babel-loader',
	      options: {
	        presets: ['es2015', 'stage-0', 'react']
	      }
	    },
			{
				test : /\.less$/,
				loader: 'style-loader!css-loader!less-loader'
			},
			{
				test: /\.(png|jpg|svg)$/,
				loader: ['url-loader', 'image-webpack-loader']
			}
		]
	},
	resolve: {
    extensions: ['.js', '.less']
	},
	plugins : [
		new webpack.ProvidePlugin({
        PropTypes: 'prop-types',
        React: 'react',
        Component: ['react', 'Component'],
        cn: 'classnames',
        get: ['lodash', 'get'],
        map: ['lodash', 'map'],
        assign: ['lodash', 'assign'],
        Link: ['react-router', 'Link'],
        Button: ['semantic-ui-react', 'Button'],
        Icon: ['semantic-ui-react', 'Icon'],
    }),
		failPlugin,
		new copyWebpackPlugin([{
			from: path.join(__dirname, 'src/html'),
			to: path.join(__dirname, 'build')
		}])
	]
};

module.exports = config;
