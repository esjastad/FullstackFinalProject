import React, { Component } from "react"; //Import component from react for the class to extend from.
import "./Home.css";

export class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			randDrink: [],
		};

		this.parseIngMeasure = this.parseIngMeasure.bind(this);
	}

	// Once mounted, find a random drink to display
	componentDidMount() {
		let url = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				this.setState({
					randDrink: data.drinks[0],
				});
			})
			.catch((error) => console.log(error));
	}

	// Parse ingredients and measurements for card, returns an unordered list with the ingredients and measurements
	parseIngMeasure(drink) {
		let listIngredients = [];
		let listMeasures = [];
		for (var ingredient in drink) {
			var ingTemp = ingredient.split("strIngredient");
			var measureTemp = ingredient.split("strMeasure");
			// Check if drinkIngredient is valid
			if (
				ingTemp[0] === "" &&
				drink[ingredient] != null &&
				drink[ingredient] !== ""
			) {
				listIngredients.push(drink[ingredient]);
			}
			// Check if the drink measurement is valid
			if (
				measureTemp[0] === "" &&
				drink[ingredient] != null &&
				drink[ingredient] !== ""
			) {
				listMeasures.push(drink[ingredient]);
			}
		}

		// Combine ingredients and measurements into list items
		let element = listIngredients.map((item, index) => {
			return (
				<li key={index}>
					{item}: {listMeasures[index]}
				</li>
			);
		});

		return <ul id="card-list">{element}</ul>;
	}

	render() {
		return (
			<React.Fragment>
				{/* Introduction header */}
				<div className="justify-content-center" id="homeHeader">
					<h2 id="homeH1">Welcome to Cocktail Mastery!</h2>
					<div className="justify-content-center" id="homeIntro">
						<p>
							This website was designed for those interested in
							mastering their mixology skills! To do this, we have
							created a handy reference guide found under the
							search tab, and once you are ready to test your
							skills, you can play the mixology game! Please sign
							in if you would like to save your scores and unlock
							new titles in your journey to become a full-fledged
							mixologist!
						</p>
					</div>
				</div>
				{/* Random drink of the minute */}
				<div className="d-flex justify-content-center">
					<div className="card" id="homeRandomCard">
						<div className="row" id="rowHome">
							<div className="col-auto">
								<img
									id="homeRandomImg"
									src={this.state.randDrink.strDrinkThumb}
									alt={this.state.randDrink.strDrink}
									className="img-fluid rounded"
								/>
							</div>
							<div className="col">
								<div className="card-block px-2">
									<h3 className="card-title" id="card-title">
										Drink of the Minute:{" "}
										{this.state.randDrink.strDrink}
									</h3>
									<p className="card-text" id="card-text">
										<b>Type:</b>{" "}
										{this.state.randDrink.strAlcoholic}
									</p>
									<p className="card-text" id="card-text">
										<b>Ingredients:</b>
									</p>
									{this.parseIngMeasure(this.state.randDrink)}
								</div>
							</div>
						</div>
						<p id="homeRandomInstructions">
							<b>Instructions:</b>
							<br /> {this.state.randDrink.strInstructions}
						</p>
					</div>
				</div>
				{/* Drink instructions */}
				<div className="justify-content-center" id="homeHeader">
					<h2 id="homeH1">Game Instructions!</h2>
					<div className="justify-content-center" id="homeIntro">
						<p>
							Click on the Game tab to test your mixology skills.
							To earn points, choose the correct glass and
							ingredients. Once you submit, your guesses will be
							evaluated and a score will be assigned. There are
							two modes in the game, normal and hard mode. In
							normal mode, your points are limited but the system
							will help to guide you by limiting selections in
							each row to the correct number of ingredients. The
							trade off of normal mode is the amount of potential
							points to be scored!
						</p>
					</div>
				</div>
			</React.Fragment>
		);
	}
}
