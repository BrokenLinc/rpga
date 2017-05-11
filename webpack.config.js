var path = require('path');
var webpack = require('webpack');

var copyPlugin = require('copy-webpack-plugin');
var failPlugin = require('webpack-fail-plugin');
var extractTextPlugin = require('extract-text-webpack-plugin');

function config(env) {

	var isProduction = (env === 'prod');

	console.log('env', env);
	console.log('isProduction', isProduction);

	var lessRule = isProduction ?
		{
			test : /\.less$/,
			loader : extractTextPlugin.extract({
				fallback: 'style-loader',
				use: 'css-loader!less-loader'
			}),
		} : {
			test : /\.less$/,
			loader: 'style-loader!css-loader!less-loader'
		};

	var config = {
		entry : path.join(__dirname, 'src/js/index.js'),
		output : {
			filename: 'bundle.js',
			path: path.join(__dirname, 'build'),
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
		        presets: isProduction ?
							['es2015', 'stage-0', 'react']
							: ['es2015', 'stage-0', 'react', 'react-hmre']
		      }
		    },
				{
					test: /\.(png|jpg|svg)$/,
					loader: ['url-loader', 'image-webpack-loader']
				},
				lessRule
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
			new copyPlugin([{
				from: path.join(__dirname, 'src/html'),
				to: path.join(__dirname, 'build')
			}])
		]
	};

	if (isProduction) {
		config.plugins.push(
			new webpack.optimize.UglifyJsPlugin({
		    compress: {
		    	warnings: false
		    }
			})
		);
		config.plugins.push(new extractTextPlugin('bundle.css'));
	}

	return config;
}

module.exports = config;
