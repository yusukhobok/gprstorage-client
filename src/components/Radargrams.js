import React, { Fragment } from "react";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Nav from "react-bootstrap/Nav";

import Radargram from "./Radargram";
import DialogOpenRad from "./DialogOpenRad";


class Radargrams extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenDialog: false
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

  clearState = () => {
    this.updateState({
      isOpenDialog: false
    });
  }

  cancelOpenRad = () => {
    this.updateState({
      isOpenDialog: false
    });
  }

  openDialog = () => {
    this.updateState({
      isOpenDialog: true
    });
  }

  fileUpload = (formData) => {
    this.props.addRadargram(this.props.project.id, formData);
  }

  render() {
    return (
      <Fragment>
        <DialogOpenRad 
          show = {this.state.isOpenDialog}
          onCancelOpenRad = {this.cancelOpenRad}
          fileUpload = {this.fileUpload}
        />
        <Nav
          activeKey="/home"
          onSelect={(selectedKey) => this.props.closeProject()}
        >
          <Nav.Item>
            <Nav.Link href="#">К проектам</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="disabled" disabled>
              Проект: <b>{this.props.project.name}</b>
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
          <Row>
            <Col sm={2}>
              <ListGroup>
                {
                  this.props.radargrams.map((item, index, array) => (
                    <ListGroup.Item action href={`#${item.id}`} key={`listkey${item.id}`}>
                      {item.name}
                    </ListGroup.Item>
                  ))
                }
              </ListGroup>
              <ListGroup.Item key={`listkey_new`}>
                <a href="#" onClick={this.openDialog}>Добавить</a>
              </ListGroup.Item>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                {
                  this.props.radargrams.map((item, index, array) => (
                    <Tab.Pane eventKey={`#${item.id}`} key={`contentkey${item.id}`}>
                      <Radargram 
                        project={this.props.project} 
                        radargram={item} 
                        key={`radkey${item.id}`} 
                        deleteRadargram={this.props.deleteRadargram}
                        getRadargramLink={this.props.getRadargramLink}
                      />
                    </Tab.Pane>
                  ))
                }
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Fragment>

    );
  }
}

export default Radargrams;





