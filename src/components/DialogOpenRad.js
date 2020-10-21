import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";


class DialogOpenRad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      loading: false,
    };
  }

  setLoading = (loading) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        loading: loading,
      };
    });
  };

  onFileChange = (event) => {
    console.log("onFileChange");
    if (event.target === null) return;
    if (event.target.files == null) return;
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    this.setState((prevState) => {
      return {
        ...prevState,
        selectedFile: selectedFile,
      };
    });
  };

  onFileUpload = async (event) => {
    console.log("onFileUpload");
    if (this.state.selectedFile !== null) {
      let formData = new FormData();
      formData.append(
        "datafile",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
      this.setLoading(true);
      this.props.fileUpload(formData);
    }
  };

  render() {
    const btnCaption = !this.state.loading ? (
      "Открыть"
    ) : (
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />
    );

    return (
      <Form>
        <Modal show={this.props.show} onHide={this.props.onCancelOpenRad}>
          <Modal.Header closeButton>
            <Modal.Title>Добавить радарограмму</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.File id="rad-file" onChange={this.onFileChange} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.onCancelOpenRad}>
              Отмена
            </Button>
            <Button
              variant="primary"
              disabled={this.state.selectedFile === null}
              onClick={this.onFileUpload}
            >
              {btnCaption}
            </Button>
          </Modal.Footer>
        </Modal>
      </Form>
    );
  }
}

export default DialogOpenRad;
