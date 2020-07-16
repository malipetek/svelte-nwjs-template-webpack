const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NwjsWebpackPlugin = require('nwjs-webpack-plugin');
const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	target: 'node-webkit',
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.svelte'],
		mainFields: ['svelte', 'module', 'main']
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			}
		]
	},
	mode,
	plugins: (() => {
	 const plugins = [
		new MiniCssExtractPlugin({
			filename: '[name].css'
		})
		]
		if (!prod) {
			plugins.push(
			  new NwjsWebpackPlugin({
				command: 'nw',
				commandDir: __dirname,
				args: ['--disable-gpu']
			}),
			);
		  }
		  return plugins;
	})(),
	devtool: prod ? false: 'source-map'
};
