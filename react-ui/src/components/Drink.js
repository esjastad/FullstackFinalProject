import React, { Component } from "react"; //Import component from react for the class to extend from.
import "./Search.css";
import { Card, Modal, Button } from "react-bootstrap";
import { AddFav } from "./Favorites";

export class SearchDrinkModal extends Component {
	constructor(props) {
		super(props);
		// State elements for each of the items to display for the modal
		this.state = {
			modalShow: false, // When true, modal will show
			modalTitle: "",
			modalIngredients: "",
			modalType: "",
			modalGlass: "",
			modalCategory: "",
			modalInstructions: "",
		};

		this.modalShow = this.modalShow.bind(this);
		this.modalClose = this.modalClose.bind(this);
		this.modalUpdate = this.modalUpdate.bind(this);
	}

	modalShow() {
		this.setState({
			modalShow: true,
		});
	}

	modalClose() {
		this.setState({
			modalShow: false,
		});
	}

	// Update modal values with input variables
	modalUpdate(title, type, category, glass, ingredients, instructions) {
		this.setState({
			modalTitle: title,
			modalType: type,
			modalCategory: category,
			modalGlass: glass,
			modalIngredients: ingredients,
			modalInstructions: instructions,
		});
	}

	render() {
		return (
			// Modal with all of the drink information to be displayed when clicked
			<div className="container mt-5">
				<Modal show={this.state.modalShow} onHide={this.modalClose}>
					<Modal.Header closeButton>
						<Modal.Title>{this.state.modalTitle}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<b>Type:</b> {this.state.modalType}
						<br />
						<b>Glass:</b> {this.state.modalGlass}
						<br />
						<b>Category:</b> {this.state.modalCategory}
						<br />
						<b>Ingredients:</b> {this.state.modalIngredients}
						<b>Instructions:</b> {this.state.modalInstructions}
						<br />
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={this.modalClose}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>
				{this.props.select === "name" && (
					<Drink
						data={this.props.data}
						showModal={this.modalShow}
						modalUpdate={this.modalUpdate}
						user={this.props.user}
						error={this.props.error}
					/>
				)}
				{this.props.select === "i" && (
					<DrinkFilter
						data={this.props.data}
						showModal={this.modalShow}
						modalUpdate={this.modalUpdate}
						user={this.props.user}
						error={this.props.error}
					/>
				)}
			</div>
		);
	}
}

export class Drink extends Component {
	constructor(props) {
		super(props);

		this.handleDrinkClick = this.handleDrinkClick.bind(this);
	}

	// Whenever a drink is clicked, update the modal and show with all additional information
	handleDrinkClick(item) {
		let ingredients = this.parseIngMeasure(item);
		this.props.modalUpdate(
			item.strDrink,
			item.strAlcoholic,
			item.strCategory,
			item.strGlass,
			ingredients,
			item.strInstructions
		);
		this.props.showModal();
	}

	// Parse ingredients for the cards, returns a comma separated string
	parseIng(drink) {
		let listIngredients = "";
		for (var ingredient in drink) {
			var stringTemp = ingredient.split("strIngredient");
			// Check if drinkIngredient is valid
			if (
				stringTemp[0] === "" &&
				drink[ingredient] != null &&
				drink[ingredient] !== ""
			) {
				// If it is the first ingredient, add it to the string, if not add a comma and the ingredient
				if (ingredient === "strIngredient1") {
					listIngredients += drink[ingredient];
				} else {
					listIngredients += `, ${drink[ingredient]}`;
				}
			}
		}
		return listIngredients;
	}

	// Parse ingredients and measurements for Modal, returns an unordered list with the ingredients and measurements
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

		return <ul>{element}</ul>;
	}

	// Format Cards for printing results in the search bar
	formatCards() {
		let user = this.props.user.loginname;
		// Error checking, if the data is empty
		if (this.props.data === null) {
			return <h1 id="searchEmpty">No results found</h1>;
		} else {
			let element = this.props.data.map((item, index) => {
				let listIngredients = this.parseIng(item);
				return (
					// Clickable card, clicking expands all of the information in modal
					<Card id="drinkCard" key={index}>
						<Card.Img
							variant="top"
							src={item.strDrinkThumb}
							alt={item.strDrink}
							onClick={() => this.handleDrinkClick(item)}
						/>
						<Card.Body onClick={() => this.handleDrinkClick(item)}>
							<Card.Title>{item.strDrink}</Card.Title>
							<Card.Text>Type: {item.strAlcoholic}</Card.Text>
							<Card.Text>Category: {item.strCategory}</Card.Text>
							<Card.Text>
								Ingredients: {listIngredients}
							</Card.Text>
						</Card.Body>
						{/* If logged in, add a footer with an add favorites button */}
						{user === "" ? (
							<></>
						) : (
							<Card.Footer>
								<AddFav user={user} id={item.idDrink} />
							</Card.Footer>
						)}
					</Card>
				);
			});
			return <div className="drinkContainer">{element}</div>;
		}
	}

	render() {
		return this.formatCards();
	}
}

export class DrinkFilter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			drink: [],
			isLoaded: false,
		};

		this.handleDrinkClick = this.handleDrinkClick.bind(this);
	}

	componentDidMount() {
		if (this.props.data !== null) {
			this.props.data.forEach((item) => {
				let url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${item.idDrink}`;

				fetch(url)
					.then((response) => response.json())
					.then((data) => {
						return data.drinks;
					})
					.then((drinks) => {
						this.state.drink.push(drinks[0]);
					})
					.catch((error) => console.log(error));
			});
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.data !== prevProps.data) {
			this.setState({
				drink: [],
			});
			if (this.props.data !== null) {
				this.props.data.forEach((item) => {
					let url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${item.idDrink}`;

					fetch(url)
						.then((response) => response.json())
						.then((data) => {
							return data.drinks;
						})
						.then((drinks) => {
							this.setState({
								isLoaded: true,
							});
							this.state.drink.push(drinks[0]);
						})
						.catch((error) => console.log(error));
				});
			}
		}
	}

	// Parse ingredients for the cards, returns a comma separated string
	parseIng(drink) {
		let listIngredients = "";
		for (var ingredient in drink) {
			var stringTemp = ingredient.split("strIngredient");
			// Check if drinkIngredient is valid
			if (
				stringTemp[0] === "" &&
				drink[ingredient] != null &&
				drink[ingredient] !== ""
			) {
				// If it is the first ingredient, add it to the string, if not add a comma and the ingredient
				if (ingredient === "strIngredient1") {
					listIngredients += drink[ingredient];
				} else {
					listIngredients += `, ${drink[ingredient]}`;
				}
			}
		}
		return listIngredients;
	}

	// Parse ingredients and measurements for Modal, returns an unordered list with the ingredients and measurements
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

		return <ul>{element}</ul>;
	}

	// Whenever a drink is clicked, update the modal and show with all additional information
	handleDrinkClick(item) {
		let ingredients = this.parseIngMeasure(item);
		this.props.modalUpdate(
			item.strDrink,
			item.strAlcoholic,
			item.strCategory,
			item.strGlass,
			ingredients,
			item.strInstructions
		);
		this.props.showModal();
	}

	// Format Cards for printing results in the search bar
	formatCards() {
		let user = this.props.user.loginname;

		// Error checking, if the data is empty
		if (this.props.data === null || this.props.error === true) {
			return <h1 id="searchEmpty">No results found</h1>;
		} else {
			if (this.state.isLoaded === false) {
				let element = this.props.data.map((item, index) => {
					return (
						// Clickable card, clicking expands all of the information in modal
						<Card id="drinkCard" key={index}>
							<Card.Img
								variant="top"
								src={item.strDrinkThumb}
								alt={item.strDrink}
							/>
							<Card.Body>
								<Card.Title>{item.strDrink}</Card.Title>
							</Card.Body>
							{/* If logged in, add a footer with an add favorites button */}
							{user === "" ? (
								<></>
							) : (
								<Card.Footer>
									<AddFav user={user} id={item.idDrink} />
								</Card.Footer>
							)}
						</Card>
					);
				});
				return <div className="drinkContainer">{element}</div>;
			} else {
				let element = this.state.drink.map((item, index) => {
					let listIngredients = this.parseIng(item);
					return (
						// Clickable card, clicking expands all of the information in modal
						<Card id="drinkCard" key={index}>
							<Card.Img
								variant="top"
								src={item.strDrinkThumb}
								alt={item.strDrink}
								onClick={() => this.handleDrinkClick(item)}
							/>
							<Card.Body
								onClick={() => this.handleDrinkClick(item)}
							>
								<Card.Title>{item.strDrink}</Card.Title>
								<Card.Text>Type: {item.strAlcoholic}</Card.Text>
								<Card.Text>
									Category: {item.strCategory}
								</Card.Text>
								<Card.Text>
									Ingredients: {listIngredients}
								</Card.Text>
							</Card.Body>
							{/* If logged in, add a footer with an add favorites button */}
							{user === "" ? (
								<></>
							) : (
								<Card.Footer>
									<AddFav user={user} id={item.idDrink} />
								</Card.Footer>
							)}
						</Card>
					);
				});
				return <div className="drinkContainer">{element}</div>;
			}
		}
	}

	render() {
		return this.formatCards();
	}
}
