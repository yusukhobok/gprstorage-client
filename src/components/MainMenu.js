import React, { Fragment } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

class MainMenu extends React.Component {
  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Хранилище радарограмм</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" onSelect={this.props.onSelectMenuElement}>

            {!this.props.logged &&
              <Fragment>
                <Nav.Link disabled={false} eventKey="registration">Регистрация</Nav.Link>
                <Nav.Link disabled={false} eventKey="enter">Вход</Nav.Link>
              </Fragment>
            }
            {this.props.logged &&
              <Fragment>
                <Button variant="primary">{this.props.username}</Button>
                <Nav.Link disabled={false} eventKey="exit">Выход</Nav.Link>
              </Fragment>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default MainMenu;
