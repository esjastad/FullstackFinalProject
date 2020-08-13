# CS465 Fullstack Summer 2020 final project

## Members

Erik Jastad  
Jordan Co  
Todd Graham  

This project consist of a React front end and a Node/Express backend connected to a Postgres database all Hosted via heroku at [Cocktailapp](https://cocktailmastery.herokuapp.com).
    The React front end is bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and the project structure and server code is based on this [mars repo](https://github.com/mars/heroku-cra-node).

We will be using the following APIs:

<b>TODO: add API URLS</b>

## Available Scripts

### `npm run full-install`

** RUN THIS SCRIPT FIRST <br>
There are two node applications to run for the app and thus two installs required, one for front-end(React) and one for back-end(Express).
This script run the npm install command for both

### `npm run build`

 Builds a static version of the React UI to `build` folder for the Express server to point to for non API routes. If there is no build present, the Express server will give errors on non API-routes

** NOTE: If major issues arise with the build script, try deleting the node_modules and package-lock.json within
         react-ui directory before running the script again.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run dev`

This script uses the `concurrently` node package to simutaneously run React front end on port 3000 and the Express backend on port 5000. Because this command starts a React server the build folder is not necessary.

### `npm run client`

Runs just the React front end on localhost port 3000.

### `npm run server`

Dev version of `npm start`. This script starts up the express sever using the `nodemon` package. This package monitors and updates any changes in the server saving the hassle of restarting the server.

## Heroku

### `heroku local`

This will deploy a local heroku instance of the app.
