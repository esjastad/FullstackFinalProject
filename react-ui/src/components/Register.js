import React, { Component } from "react"; //Import component from react for the class to extend from.
import { Redirect } from "react-router";
import { postRequest } from "../ApiCaller";
import { Modal, Button } from "react-bootstrap";

export class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      modalBody: "",
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.modalBody = this.modalBody.bind(this);
  }

  handleShow() {
    this.setState({
      modalShow: true,
    });
  }

  handleClose() {
    this.setState({
      modalShow: false,
    });
  }

  modalBody(msg) {
    this.setState({
      modalBody: msg,
    });
  }

  render() {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col">
            <div className="card mx-auto">
              <div className="card-body">
                <Modal show={this.state.modalShow} onHide={this.handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Registration Status</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{this.state.modalBody}</Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                <h1
                  className="card-title"
                  style={{ borderBottom: "1px solid #efefef" }}
                >
                  Cocktail Bar Sign Up {this.state.myVar}
                </h1>
                <RegForm show={this.handleShow} modalBody={this.modalBody} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


class RegForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      confirmPass: "",
      user: {},
      redirectLogin: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.toLogin = this.toLogin.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault(event);
    this.clearForm();
;
    const loginInfo = {
      loginname: this.state.username,
      password: this.state.password,
    };

    // Password confirmation failure.
    if (loginInfo.password !== this.state.confirmPass) {
      this.props.modalBody("Passwords do not match!!!");
      this.props.show();
    } else {
    // Add user to database
      postRequest("/user/adduser", loginInfo)
        .then((resp) => {
          if (resp.ok) {
            // this.props.modalBody("SUCCESS! Come have a drink!");
            // this.props.show();
            this.setState({redirectLogin: true})
          } else {
            this.props.modalBody("User already exist, Please login");
            this.props.show();
            // throw Error("User already exist")
          }
        })
        // .catch((error) => {
        //   console.log(error);
        // });
    }
  }

  clearForm() {
    this.setState({
      username: "",
      password: "",
      confirmPass: "",
    });
  }

  toLogin() {
    this.setState({ redirectLogin: true });
  }

  render() {
    if (this.state.redirectLogin) {
      return <Redirect push to="/login" />;
    }

    return (
      <form className="loginform" noValidate onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            className="form-control"
            id="username"
            required
            placeholder="Enter username"
            value={this.state.username}
            onChange={this.handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            id="password"
            required
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm password">Confirm Password</label>
          <input
            type="password"
            name="confirmPass"
            className="form-control"
            id="confirm password"
            required
            placeholder="Confirm Password"
            value={this.state.confirmPass}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-secondary float-right"
          onClick={this.clearForm}
        >
          Cancel
        </button>
        <div className="mt-3 text-center">
          <span>Dont have an account? </span>
          <a className="login" href="/#" onClick={this.toLogin}>
            Login
          </a>
        </div>
      </form>
    );
  }
}
