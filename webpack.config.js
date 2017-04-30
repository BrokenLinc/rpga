var path = require('path'),
	failPlugin = require('webpack-fail-plugin'),
	copyWebpackPlugin = require('copy-webpack-plugin'),
	webpack = require('webpack'),
	ExtractPlugin = require('extract-text-webpack-plugin')
;

var isProduction = process.env.NODE_ENV ? process.env.NODE_ENV.trim() == 'production' : false,
	extractCSS = false,
	serverPort = 8080,
	outputPath = path.join(__dirname, 'build'),
	outputFileName = 'bundle.js'
;

var config = {
	context : path.join(__dirname, 'src'),
	entry : [
		'./js/index.js',
	],
	output : {
		path : outputPath,
		filename : outputFileName,
	},
	devtool : isProduction ? null : 'source-map',
	devServer : {
		outputPath : outputPath,
		contentBase: './build',
		port : serverPort,
  	hot: true,
  	stats: { colors: true},
  	filename: outputFileName
	},
	module : {
		loaders :[
			{
	      test: /\.jsx?$/,
	      exclude: /node_modules/,
	      loader: 'babel-loader',
	      query: {
	        presets: ['es2015', 'stage-0', 'react']
	      }
	    },
			{
				test : /\.less$/,
				loader : extractCSS ? ExtractPlugin.extract('style', 'css!less') : 'style-loader!css-loader!less-loader'
			},
			{
				test: /\.css$/,
				loader: extractCSS ? ExtractPlugin.extract('style', 'css') : 'style-loader!css-loader'
			},
			{
				test: /\.(png|jpg|svg)$/,
				loaders: ['url', 'image-webpack']
			}
		]
	},
	resolve: {
    extensions: ['.js', '.jsx', '.css', '.less']
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
		new copyWebpackPlugin([
			{from : 'html', to: __dirname + '/build'},
		]),
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
}

if (extractCSS) {
	config.plugins.push(new ExtractPlugin('bundle.css'));
}

module.exports = config;
