import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";


class ProjectOptions extends React.Component {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onCancelProjectOptions}>
        <Modal.Header closeButton>
          <Modal.Title>Свойства проекта</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                value={this.props.name}
                onChange={this.props.onChangeName}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Комментарии</Form.Label>
              <Form.Control
                type="textarea"
                value={this.props.notes}
                onChange={this.props.onChangeNotes}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onCancelProjectOptions}>
            Отмена
          </Button>
          <Button variant="primary" onClick={this.props.onChangeProjectOptions}>
            ОК
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ProjectOptions;
