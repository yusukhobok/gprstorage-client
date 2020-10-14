import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";


class Sign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  onChangeUsername = (event) => {
    const username = event.target.value;
    this.setState((prevState) => {
      return {
        ...prevState,
        username
      };
    });
  }

  onChangePassword = (event) => {
    const password = event.target.value;
    this.setState((prevState) => {
      return {
        ...prevState,
        password
      };
    });
  }

  onOk = (event) => {
    if (event === undefined) return;
    if (this.state.username === "" || this.state.password === "") return;
    event.preventDefault();
    this.props.onOkSign(this.state.username, this.state.password);
  }

  onCancel = (event) => {
    event.preventDefault();
    this.props.onCancelSign(this.state.username, this.state.password);
  }


  render() {
    let toast = null;
    if (this.props.error) {
    toast =
      <Toast delay={3000} autohide>
        <Toast.Body>{this.props.error}</Toast.Body>
      </Toast>
    }

    return (
      <Modal show={true} onHide={this.onCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.isRegistration ? "Регистрация" : "Вход"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Логин</Form.Label>
              <Form.Control
                type="text"
                value={this.state.username}
                onChange={this.onChangeUsername}
                required
                placeholder="Введите имя пользователя"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                value={this.state.password}
                onChange={this.onChangePassword}
                required
                placeholder="Введите пароль"
              />
            </Form.Group>
          </Form>
          {toast}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.onOk}>
            ОК
          </Button>
          <Button variant="secondary" onClick={this.onCancel} >
            Отмена
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Sign;
