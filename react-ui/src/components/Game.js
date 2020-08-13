import React, {Component} from 'react'; //Import component from react for the class to extend from.
import { Grid, Row, Col } from 'react-flexbox-grid';
import glass from './glass.png'
import ingredient from './Ingredient.png'
import alcohol from './Alcohol.png'
import goal from './Goal.png'
import { postRequest, getRequest } from "../ApiCaller";

//Enumeration used to determine what to render
const gameIngType = {
    GLASS: 'glass',
    ALCOHOL: 'alcohol',
    INGREDIENT: 'ingredient',
    SELECTALC: 'selalc',
    SELECTING: 'seling',
}

//This class runs the cocktail mastery game
export class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,  //Once the api calls are all loaded, this is set to true causing the render function to populate non placeholders
      submit: false,  //When a user clicks submit this state is set to true causing the render function to show the results of the game

      finalScore: 0,  //Contains the finalscore after a game submission is made
      
      goalAlcIng: [], //Goal Alc inggredints
      goalNonIng: [], //Goal Non Alc ingredients
      aIng: [], //array of alcoholic ingredients
      oIng: [], //array of non alocholic ingredients
      
      extras: [],  //extra drinks data
      items: [{strDrinkThumb: goal, strDrink: "Cocktail"}], //Goal drink to make data

      preIng: "https://www.thecocktaildb.com/images/ingredients/",  //ingredient prefix address
      affIng: "-Small.png", //ingredient postfix address
      
      selectedGlass: -1,  //Store the glass selected by the user
      selectedAlcohols: [], //Stores the Alcohols selected by the user
      selectedIngredients: [],  //Stores the Ingredients selected by the user

      correctSelAlc: [],  //When submiting the following 4 arrays contain the correct and incorrect selections made by the user
      incorrectSelAlc: [],
      correctSelNon: [],
      incorrectSelNon: [],

      glassError: 0,  //The following 3 variables contain the number of errors the user made in each category
      alcError: 0,
      nonError: 0,

      gBGc: "bg-success", //The following 5 variables store boot strapnames for easy background color assignments
      aBGc: "bg-primary",
      iBGc: "bg-info",
      wBGc: "bg-warning",
      dBGc: "bg-danger",

      keys: ["1","2","3","4","5","6","7","8"],  //this array contains unique keys to be used for rendering the loading display

      glassNames: ["glass type"], //this array contains all the names of the glasses for the game
      abg: ["bg-primary"],  //the following 3 arrays contain the current background color for alcohols, ingredients and glasses
      ibg: ["bg-info"],
      gbg: ["bg-success"],

      hardmode: ""  //used to determine if the game is in hardmode
    };
  };

  //This function resets the game by setting all of the state variables back to their default setting, I tried to implement by saving the default state to a variable and then simply assigning the state to that default variable
  //For some reason this method would result in certain display errors which is why it is implemented how it is.
  resetGame(){
    this.setState({
      isLoaded: false,
      submit: false,

      finalScore: 0,
      
      goalAlcIng: [], 
      goalNonIng: [], 
      aIng: [], 
      oIng: [],
      
      extras: [], 
      items: [{strDrinkThumb: goal, strDrink: "Cocktail"}], 

      preIng: "https://www.thecocktaildb.com/images/ingredients/", 
      affIng: "-Small.png", 
      
      selectedGlass: -1,
      selectedAlcohols: [],
      selectedIngredients: [],

      correctSelAlc: [],
      incorrectSelAlc: [],
      correctSelNon: [],
      incorrectSelNon: [],

      glassError: 0,
      alcError: 0,
      nonError: 0,

      gBGc: "bg-success",
      aBGc: "bg-primary",
      iBGc: "bg-info",
      wBGc: "bg-warning",
      dBGc: "bg-danger",

      keys: ["1","2","3","4","5","6","7","8"],

      glassNames: ["glass type"],
      abg: ["bg-primary"],
      ibg: ["bg-info"],
      gbg: ["bg-success"],

      hardmode: ""
    });

    //Call DidMount to start the game
    this.componentDidMount();
  }

  //This function takes in an ENUM value of gameIngType and renders a loading ingredient as a placeholder until the api calls finish
  renderLoadingPiece(data){
    //Get a reference to the background arrays and the unique keys to be used
    const {gbg, abg, ibg, keys} = this.state

    switch(data){
      default:
        console.log("ENUM not set for renderGamePiece(edata)");
        break;

      case gameIngType.INGREDIENT:        
          return(
          keys.map((key) => (
            <span key={key} className="container">
              <img id="gimg" className= {ibg[0] + " border-1 m-3"} type="image" alt="ingredient" src={ingredient}/>
              <p className="text-block">Ingredient</p>
            </span>
              
          ))
        );  
      case gameIngType.ALCOHOL:
        return(
          keys.map((key) => (
            <span key={key} className="container">
              <img id="gimg" className= {abg[0] + " border-1 m-3"} type="image" alt="alcohol" src={alcohol}/>
              <p className="text-block">Alcohol</p>
            </span>
              
          ))
        );  
      case gameIngType.GLASS:
        return(
          keys.map((key) => (
            <span key={key} className="container">
              <img id="gimg" className= {gbg[0] + " border-1 m-3"} type="image" alt="glass"src={glass}/>
              <p className="text-block">Glass</p>
            </span>
              
          ))
        );      
    }
  };
  
  //This function take in an ENUM of gameIngType and renders the respective loaded game piece
  renderGamePiece(data){
    //Get references to alcohols ingredient and glassnames, url prefix and affix, and backgrounds 
    const {aIng,oIng, glassNames, preIng, affIng, gbg, abg, ibg} = this.state

    switch(data){
      default:
        console.log("ENUM not set for renderGamePiece(data)");
        break;

      case gameIngType.INGREDIENT:        
          return(
          oIng.map((non, i) => (
            <span key={non} className="container">
              <img id="gimg" onClick={() => this.handleClick(i, data)} onMouseOver={() => this.handleMouseOver(i, data)}  onMouseLeave={() => this.handleMouseLeave(i, data)} className= {ibg[i] + " border-1 m-3"} type="image" alt={non}src={preIng+ non + affIng}/>
              <p className="text-block">{non.substring(0, Math.min(non.length, 16))}</p>
            </span>
              
          ))
        );  

      case gameIngType.ALCOHOL:
        return(
          aIng.map((alc, i) => (
            <span key={alc} className="container">
              <img id="gimg" onClick={() => this.handleClick(i, data)} onMouseOver={() => this.handleMouseOver(i, data)}  onMouseLeave={() => this.handleMouseLeave(i, data)} className= {abg[i] + " border-1 m-3"} type="image" alt={alc}src={preIng+ alc + affIng}/>
              <p className="text-block">{alc.substring(0, Math.min(alc.length, 16))}</p>
            </span>
              
          ))
        );  

      case gameIngType.GLASS:
        return(
          glassNames.map((gname, i) => (
            <span key={gname} className="container">
              <img id="gimg" onClick={() => this.handleClick(i, data)} onMouseOver={() => this.handleMouseOver(i, data)}  onMouseLeave={() => this.handleMouseLeave(i, data)} className= {gbg[i] + " border-1 m-3"} type="image" alt={gname}src={glass}/>
              <p className="text-block">{gname.substring(0, Math.min(gname.length, 16))}</p>
            </span>
              
          ))
        );      
    }
  };

  //This function renders the errors and score the user earned when making the specified drink, it takes in an ENUM of gameIngType
  renderResults(data){
    //Get references to goal alcohols and ingredients and the url prefix and affix
    const {goalNonIng,goalAlcIng, preIng, affIng} = this.state

    switch(data){
      default:
        console.log("ENUM not set for renderResults(data)");
        break;

      case gameIngType.INGREDIENT:        
        return (
          <div>
            <div className="d-flex flex-row justify-content-center">
              {goalNonIng.map((non) => (
                <div key = {non} ><img id="rimg" className="bg-warning border-1 m-1" type="image" alt={non}src={preIng + non + affIng}/></div>
              ))}
            </div>
            {goalNonIng.map((non) => (<div key = {non} className ="text-center">{non}</div>))}
          </div>
        );

      case gameIngType.ALCOHOL:
        return (
          <div>
            <div className="d-flex flex-row justify-content-center">
              {goalAlcIng.map((alc) => (
                <div key = {alc}><img id="rimg" className="bg-warning border-1 m-1" type="image" alt={alc}src={preIng + alc + affIng}/></div>
              ))}
            </div>
            {goalAlcIng.map((alc) => (<div key = {alc} className ="text-center">{alc}</div>))}
          </div>
        );

      case gameIngType.SELECTALC:
        return (
          <div>
           <div className="d-flex flex-row justify-content-center">
              {this.state.correctSelAlc.map((alc) => (
                <div key = {alc}><img id="rimg" className="bg-warning border-1 m-1" type="image" alt={alc}src={preIng + alc + affIng}/></div>
              ))}
              {this.state.incorrectSelAlc.map((alc) => (
                <div key = {alc}><img id="rimg" className="bg-danger border-1 m-1" type="image" alt={alc}src={preIng + alc + affIng}/></div>
              ))}
            </div>
            {this.state.correctSelAlc.map((alc) => (<div key = {alc} className ="text-center">{alc}</div>))}
            {this.state.incorrectSelAlc.map((alc) => (<div key = {alc} className ="text-center">{alc}</div>))}
          </div>
        );

      case gameIngType.SELECTING:
        return (
          <div>
            <div className="d-flex flex-row justify-content-center">
              {this.state.correctSelNon.map((non) => (
                <div key = {non} ><img id="rimg" className="bg-warning border-1 mx-1" type="image" alt={non} src={preIng + non + affIng}/></div>
              ))}
              {this.state.incorrectSelNon.map((non) => (
                <div key = {non} ><img id="rimg" className="bg-danger border-1 mx-1" type="image" alt={non} src={preIng + non + affIng}/></div>
              ))}
            </div>
            {this.state.correctSelNon.map((non) => (<div key = {non} className ="text-center">{non}</div>))}
            {this.state.incorrectSelNon.map((non) => (<div key = {non} className ="text-center">{non}</div>))}
          </div>
        );
    }
  };

  //This function determines how to render the hardmode button when the game is loaded
  renderHardmode(){
    if (this.props.hardmode)
    {
      return(
        <div className = "d-flex mt-2 justify-content-center">
          <button onClick = {() => this.handleHMClick(this.props.hmclick)}>Hardmode <h6 className="bg-danger">On</h6></button>
        </div>
      );
    }
    else{
      return(
        <div className = "d-flex mt-2 justify-content-center">
          <button onClick = {() => this.handleHMClick(this.props.hmclick)}>Hardmode <h6 className="bg-success">Off</h6></button>
        </div>
      );
    }
  }

  //This function determines how to render the hardemode button when the game is not loaded
  renderHMLoad(){
    if (this.props.hardmode)
    {
      return(
        <div className = "d-flex mt-2 justify-content-center">
          <button>Hardmode <h6 className="bg-danger">On</h6></button>
        </div>
      );
    }
    else{
      return(
        <div className = "d-flex mt-2 justify-content-center">
          <button>Hardmode <h6 className="bg-success">Off</h6></button>
        </div>
      );
    }
  }

  //This function handles the game swapping from hardmode on and off, it takes a function as the input that is passed in as a property from App.js
  handleHMClick(func){
    func();
    this.resetGame();
    return;
  }

  //This function handles behaviour when the mouse moves over an ingreient, it takes in an index that identifies the ingredient in the respective array and an ENUM of gameIngType
  handleMouseOver(i, data){
    //Get references to each ingredients respective background arrays
    const {gbg, abg, ibg} = this.state
    var temp = [];

    switch(data){
      default:
        console.log("ENUM not set for ingredient handleMouseOver(i, data) function call");
        break;

      case gameIngType.INGREDIENT: 
        temp = ibg;
        temp[i] = "bg-secondary"
        this.setState({
          ibg: temp
        })
        break;

      case gameIngType.ALCOHOL:
        temp = abg;
        temp[i] = "bg-secondary"
        this.setState({
          abg: temp
        })
        break;

      case gameIngType.GLASS:
        temp =gbg;
        temp[i] = "bg-secondary"
        this.setState({
          gbg: temp
        })
        break;
      }

    return;
  };

  //This function handles the behaviour when the mouse stops hovering over an ingredient, it takes in an index to identify the respective ingredient in its respective array and an ENUM of gameIngType
  handleMouseLeave(i, data){
    //Get references to background arrays and selected game pieces
    const {gbg, abg, ibg, selectedIngredients, selectedAlcohols, selectedGlass} = this.state
    var temp =[];

    switch(data){
      default:
        console.log("ENUM not set for ingredient handleMouseOver(i, data) function call");
        break;

      case gameIngType.INGREDIENT: 
        temp = ibg;
        if(selectedIngredients.includes(i)){
          temp[i] = "bg-warning"
        }
        else{
          temp[i] = "bg-info"
        }
        this.setState({
          ibg: temp
        })
        break;

      case gameIngType.ALCOHOL:
        temp = abg;
        if(selectedAlcohols.includes(i)){
          temp[i] = "bg-warning"
        }
        else{
          temp[i] = "bg-primary"
        }
        this.setState({
          abg: temp
        })
        break;

      case gameIngType.GLASS:
        temp = gbg;
        if(selectedGlass === i)
        {
          temp[i] = "bg-warning"
        }
        else{
          temp[i] = "bg-success"
        }
        break;
    }

    return;
  };

  //This function handles the behaviour for when a game piece is clicked, it takes in an index to identify the piece clicked in its respective array and an ENUM of gameIngType to determine which array
  handleClick(i, ptype){    
    //If the game is not loaded yet then do nothing
    if(!this.state.isLoaded)
    {
      return;
    }
    //Get references to the background arrays for each ingredient type
    var atemp = this.state.abg;
    var itemp = this.state.ibg;
    var gtemp = this.state.gbg;
    
    //This section defines the hardmode behaviour where the player can select as many ingredients as they want, if already selected clicking again deselects the ingredient
    if(this.props.hardmode)
    {
      switch(ptype){
        default:
          console.log("ERROR in handleClick(i, ptype) enum not set")
          break;

        case gameIngType.GLASS:
          if (this.state.selectedGlass > -1){
            gtemp[this.state.selectedGlass] = "bg-success"
            gtemp[i] = "bg-warning"
            this.setState({
              gbg: gtemp,
              selectedGlass: i
            });
          }
          else {
            gtemp[i] = "bg-warning"
            this.setState({
              gbg: gtemp,
              selectedGlass: i
            });
          }      
          break;

        case gameIngType.ALCOHOL:
          if (this.state.selectedAlcohols.includes(i)){
            for( let x = 0; x < this.state.selectedAlcohols.length; ++x){ 
              if ( this.state.selectedAlcohols[x] === i) { 
                this.state.selectedAlcohols.splice(x, 1); 
                --x; 
              }
            }
            atemp[i] = "bg-primary"
          }
          else {
            atemp[i] = "bg-warning"
            this.state.selectedAlcohols.push(i); 
          }
          this.setState({
            abg: atemp
          });
          break;

        case gameIngType.INGREDIENT:
          if (this.state.selectedIngredients.includes(i)){
            for( let x = 0; x < this.state.selectedIngredients.length; ++x){ 
              if ( this.state.selectedIngredients[x] === i) { 
                this.state.selectedIngredients.splice(x, 1); 
                --x; 
              }
            }
            itemp[i] = "bg-info"
          }
          else{
            itemp[i] = "bg-warning"
            this.state.selectedIngredients.push(i);
          }
          this.setState({
            ibg: itemp,
          });
          break;
      }
    }
    //This section defines the behaviour of user selections when hardmode is off, it checks if the number of user selections exceeds the length of goal ingredients and automatically deselects the first ingredient selected
    //If the user selects an ingredient that is already selected it will then be deselected
    else{
      switch(ptype){
        default:
          console.log("ERROR in handleClick(i, ptype) enum not set")
          break;

        case gameIngType.GLASS:
          if (this.state.selectedGlass > -1){
            gtemp[this.state.selectedGlass] = "bg-success"
            gtemp[i] = "bg-warning"
            this.setState({
              gbg: gtemp,
              selectedGlass: i
            });
          }
          else {
            gtemp[i] = "bg-warning"
            this.setState({
              gbg: gtemp,
              selectedGlass: i
            });
          }      
          break;

        case gameIngType.ALCOHOL:
          if (this.state.selectedAlcohols.includes(i)){
            for( let x = 0; x < this.state.selectedAlcohols.length; ++x){ 
              if ( this.state.selectedAlcohols[x] === i) { 
                this.state.selectedAlcohols.splice(x, 1); 
                --x; 
              }
            }
            atemp[i] = "bg-primary"
          }
          else {
            if(this.state.selectedAlcohols.length >= this.state.goalAlcIng.length){
              let temp = this.state.selectedAlcohols.shift();
              atemp[temp] = "bg-primary";
            }
            atemp[i] = "bg-warning"
            this.state.selectedAlcohols.push(i); 
          }
          this.setState({
            abg: atemp
          });
          break;

        case gameIngType.INGREDIENT:
          if (this.state.selectedIngredients.includes(i)){
            for( let x = 0; x < this.state.selectedIngredients.length; ++x){ 
              if ( this.state.selectedIngredients[x] === i) { 
                this.state.selectedIngredients.splice(x, 1); 
                --x; 
              }
            }
            itemp[i] = "bg-info"
          }
          else{
            if(this.state.selectedIngredients.length >= this.state.goalNonIng.length){
              let temp = this.state.selectedIngredients.shift();
              itemp[temp] = "bg-info";
            }
            itemp[i] = "bg-warning"
            this.state.selectedIngredients.push(i);
          }
          this.setState({
            ibg: itemp,
          });
          break;
      }
    }
  };

  //This function parses all of the ingredients for the passed in drink from cocktailDB Api, it then checks if each ingredient is alcoholic or not with another API call, it also checks if the ingredient is already in the array of respective ingredients
  parseIngredients(drink, goal = false){
    //Loop through each element of drink to see if it is an ingredient
    for (var ingredient in drink){
      var stringTemp = ingredient.split("strIngredient");
      if (stringTemp[0] === "" && drink[ingredient] != null)
      {
        fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?i=" + drink[ingredient])
        .then(res => res.json())
        .then(
          (result) => {
            if(result.ingredients){
              if(result.ingredients[0].strAlcohol!=null && !this.state.aIng.includes(result.ingredients[0].strIngredient)) {
                this.state.aIng.push(result.ingredients[0].strIngredient);
                this.state.abg.push(this.state.aBGc);
                if(goal)
                  this.state.goalAlcIng.push(result.ingredients[0].strIngredient);
              }
              else if (!this.state.oIng.includes(result.ingredients[0].strIngredient) && result.ingredients[0].strAlcohol == null){
                this.state.oIng.push(result.ingredients[0].strIngredient);
                this.state.ibg.push(this.state.iBGc);
                if(goal)
                  this.state.goalNonIng.push(result.ingredients[0].strIngredient);
              }
            }
          },       
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )            
      }  
    }
  };

  //This function is implicitly called by the component and starts the data fetching to assemble the game and state
  componentDidMount() {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(
      (result) => {
        this.state.glassNames.push(result.drinks[0].strGlass);
        this.state.gbg.push(this.state.gBGc);
        this.state.items.shift();
        this.state.items.push(result.drinks[0]);
        this.parseIngredients(this.state.items[0], true);
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
    //After a short delay populate additional drink ingredients and glasses, a delay is used to help ensure that the first ingredients and glass in the respective arrays is the goal glass and ingredients
    setTimeout(() => {this.populateExtras();}, 200);
    setTimeout(() => {this.populateGlasses();}, 200);
  };

  //This function gets a list of all the glasses at cocktailDB and randomly selects some to add to the game
  populateGlasses(){
    fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list")
    .then(res => res.json())
    .then(
      (result) => {
        for(let i = 0; i < 30; ++i)
        {
          let tempglass = result.drinks[Math.floor(Math.random() * (result.drinks.length-1))].strGlass
          if(!this.state.glassNames.includes(tempglass)){
            this.state.glassNames.push(tempglass)
            this.state.gbg.push(this.state.gBGc);
          }
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  };

  //This function gets additional drinks and calls to parse their ingredients to add to the game
  populateExtras(){
    for(let i = 0; i < 9; ++i){
      fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
          extras: result
        });
        this.parseIngredients(this.state.extras.drinks[0]);
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )  
    };
    //Wait for two seconds then call shiftArray which finalizes the game loading and state
    setTimeout(() => {this.shiftArray();}, 2000);
  };

  //Last function called before considered loaded, this function shifts the goal ingredients that are always at the front and reinserts them randomly into their respective arrays
  shiftArray(){
    
    this.state.glassNames.shift();

    let goalGlass = this.state.glassNames.shift();
    this.state.glassNames.splice(Math.floor(Math.random() * (this.state.glassNames.length-1)),0, goalGlass);
    
    for(let i = 0; i < this.state.goalAlcIng.length; ++i )
    {
      let goalAlc = this.state.aIng.shift();
      this.state.aIng.splice(Math.floor(Math.random() * (this.state.aIng.length-1)),0, goalAlc);
    };

    for(let i = 0; i < this.state.goalNonIng.length; ++i )
    {
      let goalIng = this.state.oIng.shift();
      this.state.oIng.splice(Math.floor(Math.random() * (this.state.oIng.length-1)),0, goalIng);
    };

    this.setState({isLoaded: true});
  };

  //This function handles behaviour when a user submits a drink for scoring
  handleSubmit(){
    //If not loaded yet, do nothing
    if(!this.state.isLoaded)
    {
      return;
    }

    //If no glass is selected alert the user
    if(this.state.selectedGlass < 0)
    {
      alert("Please Select a Glass!");
      return;
    }

    //If no ingredients were selected from either category then alert the user
    if(this.state.selectedAlcohols.length === 0 && this.state.selectedIngredients.length === 0)
    {
      alert("Please Select an Inredient!");
      return;
    }

    //Get references for easy access and set up some temporary variables
    let {glassNames, selectedGlass, items, selectedAlcohols, selectedIngredients, aIng, oIng, goalAlcIng, goalNonIng} = this.state;
    let score = 100.0;
    let total = goalAlcIng.length + goalNonIng.length + 1;
    let gerror = 0;
    let aerror = 0;
    let nerror = 0;
    let correctAlc = [];
    let incorrectAlc = [];
    let correctIng = [];
    let incorrectIng = [];

    //Check if the correct glass was selected
    if(glassNames[selectedGlass] === items[0].strGlass){
      gerror = 0;
    }
    else{
      gerror = 1;
    }

    //Check if the correct alcohols were selected
    for (var alcs in selectedAlcohols)
    {
      if(goalAlcIng.includes(aIng[selectedAlcohols[alcs]])){
        correctAlc.push(aIng[selectedAlcohols[alcs]]);
      }
      else{
        incorrectAlc.push(aIng[selectedAlcohols[alcs]]);
      }
    }

    //Check if the correct ingredients were selected
    for (var ings in selectedIngredients)
    {
      if(goalNonIng.includes(oIng[selectedIngredients[ings]])){
        correctIng.push(oIng[selectedIngredients[ings]]);
      }
      else{
        incorrectIng.push(oIng[selectedIngredients[ings]]);
      }
    }

    //Calculate the errors made amongst the alcohols and ingredients
    aerror = ((goalAlcIng.length - correctAlc.length) + incorrectAlc.length);
    nerror = ((goalNonIng.length - correctIng.length) + incorrectIng.length);

    //If this is hardmode, increase the maximum score to 100 * the total number of ingredients, otherwise the score max is 100.  Bothmodes then have a reduction from the maxscore possible based on the errors made
    if(this.props.hardmode){
      score = Math.max(((100.0 * total) - ((100.0 * total) * (aerror + nerror + gerror)/total)), 0);
    }
    else{
      score = Number((Math.max(100.0 - ((100.0 * (aerror + nerror + gerror)/total)), 0)).toFixed(0));
    }

    //Set the state data
    this.setState({
      finalScore: score,
      submit: true,
      glassError: gerror,
      alcError: aerror,
      nonError: nerror,
      correctSelAlc: correctAlc,
      incorrectSelAlc: incorrectAlc,
      correctSelNon: correctIng,
      incorrectSelNon: incorrectIng
    })

    //Check if a user is logged in to update their score and title in the database and on the page
    if(this.props.userinfo.loginname !== ""){
      //Package the data to update the score in the database
      const UpdateInfo = {
        loginname: this.props.userinfo.loginname,
        score: this.props.userinfo.score + score
      };

      //Setup the user info up, to pass for updating the page display
      var usertemp = this.props.userinfo;
      usertemp.score = UpdateInfo.score;

      //Update the score in the DB
      postRequest("/user/setscore", UpdateInfo)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }          
        },
        (error) => {
          console.log(error);
        })
        .catch((error) => {
          console.log(error);
        });

      //Get the titles
      getRequest("/titles")
        .then(res => res.json())
        .then(
            (result) => {
              //Check if the users current score exceeds the minscore for a title
              let mytitle = result[0].name;
              for (const title in result){
                if(UpdateInfo.score > result[title].minscore){
                  mytitle = result[title].name;
                }
                else{
                  break;
                }
              }
              usertemp.title = mytitle;
              //Update the user display information contained back in App.js
              this.props.refreshScore(usertemp);
            },
            (error) => {
              console.log(error);
            }
        )

      
    }
  };

  //Handle the user clicking they want to mix another drink
  handleAgain(){
    this.resetGame();
  }

  //Render the game
  render() {
    //Get state references for easy access
    const { error, submit, items, isLoaded, glassNames, finalScore} = this.state;

    //If an error was return during API calls
    if(error)
    {
      console.log(error);
      return(
        <div>An error occured trying to access the cocktailDB API</div>
      )
    }
    //If the game is not loaded yet, render placeholders
    else if(!isLoaded)
    {
      return(
        <div>
          {this.renderHMLoad()}                         
        <Grid fluid>
          <Row>          
            <div className="scroll">
              {this.renderLoadingPiece(gameIngType.GLASS)}                         
            </div>
          </Row>
          <Row>
            <div className="scroll">
              {this.renderLoadingPiece(gameIngType.ALCOHOL)}                         
            </div>          
          </Row>
          <Row>
            <div className="scroll">
              {this.renderLoadingPiece(gameIngType.INGREDIENT)}                         
            </div>          
          </Row>
          <Row>
            <Col xs md={4}>
              <h4 className="mt-4 pl-4">Select from the ingredients listed above to make the drink shown here.  </h4>
            </Col>
            <Col xs md={4}>
              <div className="mt-4 d-flex justify-content-center">
                <input id="dimg" className="border-1 border-dark" type="image" alt="DrinkToMake" src={goal}/>
                </div>
              <h3 className="text-center">Drink To Make</h3>
            </Col>
            <Col>
              <button className="mt-4"> Submit </button>
            </Col>
          </Row>
          
        </Grid>
        </div>
      );
    }
    //If the game is loaded and no submission was made then render the loaded game pieces
    else if(!submit && isLoaded) {
      return(
        <div>
          {this.renderHardmode()}                         
        <Grid fluid>
          <Row>          
            <div className="scroll">
              {this.renderGamePiece(gameIngType.GLASS)}                         
            </div>
          </Row>
          <Row>
            <div className="scroll">
              {this.renderGamePiece(gameIngType.ALCOHOL)}                         
            </div>          
          </Row>
          <Row>
            <div className="scroll">
              {this.renderGamePiece(gameIngType.INGREDIENT)}                         
            </div>          
          </Row>
          <Row>
            <Col xs md={4}>
              <h4 className="mt-4 pl-4">Select from the ingredients listed above to make the drink shown here.  </h4>
            </Col>
            <Col xs md={4}>
              <div className="mt-4 d-flex justify-content-center">
                <input id="dimg" className="border-1 border-dark" type="image" alt="DrinkToMake" src={items[0].strDrinkThumb}/>
                </div>
              <h3 className="text-center">{items[0].strDrink}</h3>
            </Col>
            <Col>
              <button className="mt-4" onClick={() => this.handleSubmit()}> Submit </button>
            </Col>
          </Row>
          
        </Grid>
        </div>
      );
    }
    //If the game is loaded and a submission was made then render the results
    else{
      return(
        <Grid fluid>
          <h3 className="d-flex justify-content-center">The drink to make </h3>
          <div className="d-flex justify-content-center">
            <input id="dimg" className="border-1 border-dark" type="image" alt="DrinkToMake" src={items[0].strDrinkThumb}/>
          </div>
          <h3 className="d-flex justify-content-center">{items[0].strDrink}</h3>
          <br></br>
          <Row>
            <Col xs md={4} className={"bg-success border d-flex flex-column justify-content-center"}>
              <h4 className="text-center">Correct Glass Type</h4>
              <img id="gimg" className="mx-auto" type="image" alt="Correct Glass" src={glass}/>
              <div className ="text-center">{items[0].strGlass}</div>
            </Col>
            <Col xs md={4} className={"bg-success border d-flex flex-column justify-content-center"}>
              <h4 className="text-center">Your Glass Type</h4>
              <img id="gimg" className="mx-auto" type="image" alt="Correct Glass" src={glass}/>
              <div className ="text-center">{glassNames[this.state.selectedGlass]}</div>
            </Col>
            <Col xs md={4} className={"bg-secondary border d-flex flex-column justify-content-center"}>
              <h4 className="text-center">Errors</h4>
              <h4 className="text-center">{this.state.glassError}</h4>
            </Col>
          </Row>
          <Row>
            <Col xs md={4} className={"bg-primary border d-flex flex-column justify-content-center"}>
              <h4 className="text-center">Correct Alcohol Ingredients</h4>
              {this.renderResults(gameIngType.ALCOHOL)}                         
            </Col>
            <Col xs md={4} className={"bg-primary border d-flex flex-column justify-content-center"}>
              <h4 className="text-center">Your Alcohol Ingredients</h4>
              {this.renderResults(gameIngType.SELECTALC)}                         
            </Col>
            <Col xs md={4} className={"bg-secondary border d-flex flex-column justify-content-center"}>
              <h4 className="text-center">Errors</h4>
              <h4 className="text-center">{this.state.alcError}</h4>
            </Col>
          </Row>
          <Row>
            <Col xs md={4} className={"bg-info border d-flex flex-column justify-content-center"}>
              <h4 className="text-center">Correct Non-Alcohol Ingredients</h4>
              {this.renderResults(gameIngType.INGREDIENT)}                         
            </Col>
            <Col xs md={4} className={"bg-info border d-flex flex-column justify-content-center"}>
              <h4 className="text-center">Your Non-Alcohol Ingredients</h4>
              {this.renderResults(gameIngType.SELECTING)}                         
            </Col>
            <Col xs md={4} className={"bg-secondary border d-flex flex-column justify-content-center"}>
              <h4 className="text-center">Errors</h4>
              <h4 className="text-center">{this.state.nonError}</h4>
            </Col>
          </Row>
          <Row>
            <Col xs md={12} className={"bg-danger border d-flex flex-column justify-content-center"}>
              <h4 className="text-center">Total Score</h4>
              <h4 className="text-center">{finalScore}</h4>
            </Col>
          </Row>
          <div className="d-flex justify-content-center">
            <button onClick={() => this.handleAgain()} >Mix Another Drink?</button>
          </div>
        </Grid>
      );
    };
  };
};

