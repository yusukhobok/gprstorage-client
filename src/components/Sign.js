import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";


class Sign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loading: false
    };
  }

  updateState = (newState) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        ...newState
      };
    });
  }


  onChangeUsername = (event) => {
    const username = event.target.value;
    this.updateState({ username });
  }

  onChangePassword = (event) => {
    const password = event.target.value;
    this.updateState({ password });
  }

  onOk = async (event) => {
    if (event === undefined) return;
    if (this.state.username === "" || this.state.password === "") return;
    event.preventDefault();
    this.updateState({ loading: true })
    await this.props.onOkSign(this.state.username, this.state.password);
    this.updateState({ loading: false })
  }

  onCancel = (event) => {
    event.preventDefault();
    this.props.onCancelSign(this.state.username, this.state.password);
  }

  render() {
    let alert = null;
    if (this.props.error) {
      alert = <Alert variant="danger">
        {this.props.error}
      </Alert>
    }

    let spinner = null;
    if (this.state.loading) {
      spinner = <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
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
          {alert}
        </Modal.Body>
        <Modal.Footer>
          { spinner }
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
