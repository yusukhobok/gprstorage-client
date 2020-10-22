import React, { Fragment } from "react";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import Container from "react-bootstrap/Container";

import ProjectOptions from "./ProjectOptions";


class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      notes: "",
      isOpenOptions: false,
      currentProjectId: null,
      isAddNewProject: false,
    };
  }

  clearState = () => {
    this.updateState({
      name: "",
      notes: "",
      isOpenOptions: false,
      currentProjectId: null,
      isAddNewProject: false,
    });
  }



  updateState = (newState) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        ...newState
      };
    });
  }

  findProjectById = (id) => {
    return this.props.projects.find(item => item.id === id)
  }

  onChangeName = (event) => {
    const name = event.target.value;
    this.updateState({ name });
  }

  onChangeNotes = (event) => {
    const notes = event.target.value;
    this.updateState({ notes });
  }

  addProject = async (name, notes) => {
    await this.props.addProject(name, notes)
    this.clearState()
  }

  changeProject = async (projectId, name, notes) => {
    await this.props.changeProject(projectId, name, notes)
    this.clearState()
  }

  onCancelProjectOptions = async () => {
    this.clearState()
  }

  onChangeProjectOptions = async () => {
    if (this.state.isAddNewProject)
      await this.addProject(this.state.name, this.state.notes)
    else
      await this.changeProject(this.state.currentProjectId, this.state.name, this.state.notes)
  }

  openDialogToAddProject = () => {
    this.updateState({ name: "", notes: "", isOpenOptions: true, currentProjectId: null, isAddNewProject: true });
  }

  openDialogToChangeProject = (event) => {
    const currentProjectId = Number(event.target.id);
    const project = this.findProjectById(currentProjectId);
    if (project === undefined) return
    this.updateState({
      name: project.name, notes: project.notes, isOpenOptions: true, currentProjectId,
      isAddNewProject: false
    });
  }

  openProject = async (event) => {
    const currentProjectId = Number(event.target.id);
    await this.props.openProject(currentProjectId);
  }

  deleteProject = async (event) => {
    const currentProjectId = Number(event.target.id);
    await this.props.deleteProject(currentProjectId);
  }

  render() {
    return (
      <Fragment>
        <Container>
          <h1>Проекты</h1>
          <CardColumns>
            {
              this.props.projects.map((item, index, array) => (
                <Card style={{ width: '18rem' }} key={item.id}>
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.notes}</Card.Text>
                    <Card.Link href="#" id={item.id} onClick={this.openProject}>Открыть</Card.Link>
                    <Card.Link href="#" id={item.id} onClick={this.openDialogToChangeProject}>Изменить</Card.Link>
                    <Card.Link href="#" id={item.id} onClick={this.deleteProject}>Удалить</Card.Link>
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">{item.createion_datetime}</small>
                  </Card.Footer>
                </Card>
              ))
            }
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Link href="#" onClick={this.openDialogToAddProject}>Добавить новый проект...</Card.Link>
              </Card.Body>
            </Card>
          </CardColumns>
        </Container>

        <ProjectOptions
          show={this.state.isOpenOptions}
          name={this.state.name}
          notes={this.state.notes}
          onChangeName={this.onChangeName}
          onChangeNotes={this.onChangeNotes}
          onCancelProjectOptions={this.onCancelProjectOptions}
          onChangeProjectOptions={this.onChangeProjectOptions}
        />
      </Fragment>
    );
  }
}

export default Projects;