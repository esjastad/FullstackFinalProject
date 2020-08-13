import React, { Component } from "react"; //Import component from react for the class to extend from.
import { Card } from "react-bootstrap";
import "./About.css";
import GitHubLogo from "./GitHub-Mark-32px.png";
export class About extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drink1: [],
			drink2: [],
			drink3: [],
		};
	}

	componentDidMount() {
		this.fetchUrl();
	}

	// Fill drink1, drink2 and drink3 with random drink items
	fetchUrl() {
		let url = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				this.setState({
					drink1: data.drinks[0].strDrinkThumb,
				});
			})
			.catch((error) => console.log(error));

		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				this.setState({
					drink2: data.drinks[0].strDrinkThumb,
				});
			})
			.catch((error) => console.log(error));

		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				this.setState({
					drink3: data.drinks[0].strDrinkThumb,
				});
			})
			.catch((error) => console.log(error));
	}

	render() {
		return (
			<React.Fragment>
				<div className="d-flex justify-content-center">
					<h1 id="aboutH1">About the Authors</h1>
				</div>
				{/* Create cards for each of the authors and use the state for drink image */}
				<div
					className="d-flex justify-content-center"
					id="aboutContainer"
				>
					<Card id="aboutCard">
						<Card.Img
							variant="top"
							src={this.state.drink1}
							alt="Favorite Drink"
						/>
						<Card.Body>
							<Card.Title>Jordan Co</Card.Title>
							<Card.Text>
								Jordan is an undergraduate student that is
								graduating Fall 2020! He's not much of a
								drinker, but he does enjoy Moscow Mules and most
								beers.
							</Card.Text>
							<Card.Text>
								<a href="https://github.com/Coleeco">
									<img
										border="0"
										alt="GitHub"
										src={GitHubLogo}
									/>
									Coleeco
								</a>
							</Card.Text>
						</Card.Body>
					</Card>

					<Card id="aboutCard">
						<Card.Img
							variant="top"
							src={this.state.drink2}
							alt="Favorite Drink"
						/>
						<Card.Body>
							<Card.Title>Todd Graham</Card.Title>
							<Card.Text>
								Todd is graduate student of computer science at
								Portland State. His favorite cocktail is a
								habanero margarita, but any spice will do.
							</Card.Text>
							<Card.Text>
								<a href="https://github.com/toddgraham121">
									<img
										border="0"
										alt="GitHub"
										src={GitHubLogo}
									/>
									toddgraham121
								</a>
							</Card.Text>
						</Card.Body>
					</Card>

					<Card id="aboutCard">
						<Card.Img
							variant="top"
							src={this.state.drink3}
							alt="Favorite Drink"
						/>
						<Card.Body>
							<Card.Title>Erik Jastad</Card.Title>
							<Card.Text>
								Erik is an undergraduate student graduating this
								Summer. He only drinks at social events, and he
								can enjoy just about any well made drink.
							</Card.Text>
							<Card.Text>
								<a href="https://github.com/esjastad">
									<img
										border="0"
										alt="GitHub"
										src={GitHubLogo}
									/>
									esjastad
								</a>
							</Card.Text>
						</Card.Body>
					</Card>
				</div>
			</React.Fragment>
		);
	}
}
