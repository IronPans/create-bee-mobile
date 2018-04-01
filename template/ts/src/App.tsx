import * as React from 'react';
import {Button} from 'bee-mobile';
import './App.scss';

export default class App extends React.PureComponent {
	render() {
		return (
			<div className="App height-100">
				<header className="App-header">
					<img src="assets/logo.svg" className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to Bee Mobile.</h1>
				</header>
				<p className="App-intro">
					To get started, edit <code>src/App.tsx</code> and save to reload.
				</p>
				<p className="App-btn">
					<Button to="https://reactjs.org/" target="_blank">React</Button>
					<Button to="https://bee-mobiles.github.io" theme="primary" target="_blank">开发文档</Button>
				</p>
			</div>
		);
	}
}
