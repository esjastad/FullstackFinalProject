import React from "react";
import "./App.css";

import { Navigation } from "./components/Navigation";
import { Home } from "./components/Home";
import { Game } from "./components/Game";
import { Search } from "./components/Search";
import { About } from "./components/About";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { getRequest } from "./ApiCaller";
import Favorites from "./components/Favorites";

import { BrowserRouter, Route, Switch } from "react-router-dom";

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: { loginname: "", score: "", title: "" },
			gameHardmode: false,
		};
		this.logout = this.logout.bind(this);
		this.login = this.login.bind(this);
		this.hardmode = this.hardmode.bind(this);
	}

	hardmode() {
		this.setState({ gameHardmode: !this.state.gameHardmode });
	}

  // Logs user in. Pass down to Login
	login(user) {
		this.setState({ user: user });
	}

  // Logs user out. Pass down to Navigation
	logout() {
		getRequest("/user/logout");
		this.setState({ user: { loginname: "", score: "", title: "" } });
	}

	render() {
		return (
			// Set a router block to render different pages based on path
			<BrowserRouter>
				<div className="container" id="siteContainer">
					<Navigation user={this.state.user} logout={this.logout} />
					<Switch>
						<Route path="/" component={Home} exact />
						<Route
							path="/game"
							render={(props) => (
								<Game
									{...props}
									hardmode={this.state.gameHardmode}
									hmclick={this.hardmode}
									userinfo={this.state.user}
									refreshScore={this.login}
								/>
							)}
						/>
						<Route
							path="/search"
							render={(props) => (
								<Search {...props} user={this.state.user} />
							)}
						/>
						<Route
							path="/login"
							render={(props) => (
								<Login {...props} login={this.login} />
							)}
						/>
						<Route
							path="/register"
							render={(props) => (
								<Register {...props} login={this.login} />
							)}
						/>
						<Route path="/about" component={About} />
						<Route
							path="/fav"
							render={(props) => (
								<Favorites {...props} user={this.state.user} />
							)}
						/>
					</Switch>
				</div>
			</BrowserRouter>
		);
	}
}
