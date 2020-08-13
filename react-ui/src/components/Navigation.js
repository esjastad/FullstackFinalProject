import React, { Component } from "react"; //Import component from react for the class to extend from.
import { NavLink, Link } from "react-router-dom";
import { Navbar, Nav, Table } from "react-bootstrap";

export class Navigation extends Component {
  constructor(props) {
    super(props);
    this.UserBanner = this.UserBanner.bind(this);
  }

  // Displays table of user info when logged in
  UserBanner() {
    let user = this.props.user;
    let title = user.title === "" ? "N/A" : user.title;
    if (user.loginname !== "") {
      return (
        <Nav >
          <Table className="my-auto mx-1 " size="sm" striped variant="dark">
            <thead>
              <tr>
                <th>User</th>
                <td>{user.loginname}</td>
                <th>Score</th>
                <td>{user.score}</td>
                <th>Title</th>
                <td>{title}</td>
              </tr>
            </thead>
          </Table>
        </Nav>
      );
    } else {
      return <></>;
    }
  }

  render() {
    const user = this.props.user;
    let loggedIn = user.loginname !== "" ? true : false;
    let loginlogout;
    if (loggedIn) {
      loginlogout = (
        <NavLink
          className="d-inline p-2 bg-dark text-white"
          to=""
          onClick={this.props.logout}
        >
          Logout
        </NavLink>
      );
    } else {
      loginlogout = (
        <>
          <Nav.Link as={Link} to="/login">
            Login
          </Nav.Link>
          <Nav.Link as={Link} to="/register">
            Sign Up
          </Nav.Link>
        </>
      );
	}
	

    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand as={Link} to="/">
          <img className="icon" src="/martini.png" alt="martini icon"></img>
          Cocktail Mastery
          <img className="icon" src="/liquor.png" alt="liquor icon"></img>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
			{loggedIn? 
            <Nav.Link as={Link} to="/fav">
              Favorites
            </Nav.Link>
			:<></>}
            <Nav.Link as={Link} to="/game">
              Game
            </Nav.Link>
            <Nav.Link as={Link} to="/search">
              Search
            </Nav.Link>
          </Nav>
          <Nav>{loginlogout}</Nav>
          {this.UserBanner()}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
