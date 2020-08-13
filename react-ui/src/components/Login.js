import React, { Component } from "react"; //Import component from react for the class to extend from.
import { Redirect } from "react-router";
import { postRequest, getTitle } from "../ApiCaller";
import { Modal, Button } from "react-bootstrap";

export class Login extends Component {
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
                    <Modal.Title>Login Status</Modal.Title>
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
                  Cocktail Bar Backdoor
                </h1>
                <Form
                  login={this.props.login}
                  show={this.handleShow}
                  modalBody={this.modalBody}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      user: {},
      redirectHome: false,
      redirectRegister: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.toRegister = this.toRegister.bind(this);
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
    const loginInfo = {
      loginname: this.state.username,
      password: this.state.password,
    };

    postRequest("/user/login", loginInfo)
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        } else {
         this.props.modalBody('No User Found');
         this.props.show();
         throw Error('Unauthorized')
        }
      })
      .then((data) => {
        let user = data[0];
        getTitle(user.score).then((name) => {
          user.title = name;
          console.log("logging in user: ", user);
          this.props.login(user);
          this.setState({ redirectHome: true });
        });
      })
      .catch(error => console.log(error));
  }

  clearForm() {
    this.setState({
      username: "",
      password: "",
    });
  }

  toRegister() {
    this.setState({ redirectRegister: true });
  }

  render() {
    if (this.state.redirectHome) {
      return <Redirect push to="/" />;
    }
    if (this.state.redirectRegister) {
      return <Redirect push to="/register" />;
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
        <div className="mt-5 text-center">
          <span>Dont have an account? </span>
          <a className="register" href="/#" onClick={this.toRegister}>
            Register
          </a>
        </div>
      </form>
    );
  }
}
