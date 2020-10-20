import "bootstrap/dist/css/bootstrap.min.css";
import React, { Fragment } from "react";

import { OK_STATUS, STATUS_NOT_LOGGED, STATUS_REGISTRATING, STATUS_ENTERING, STATUS_LOGGED, PAGE_PROJECTS, PAGE_RADARGRAMS } from "./Global";
import Logic from "./logic/Logic";

import MainMenu from "./components/MainMenu";
// import Rad from "./components/Rad";
// import ProjectOptions from "./components/ProjectOptions";
import Sign from "./components/Sign";
import Welcome from "./components/Welcome";
import Projects from "./components/Projects";
import Radargrams from "./components/Radargrams";

class App extends React.Component {
  constructor() {
    super();
    this.logic = new Logic();
    this.state = {
      status: STATUS_LOGGED, //STATUS_NOT_LOGGED,
      page: PAGE_PROJECTS,
      sign_error: null,
      is_loaded_data: false,
      waiting: false,
    };

  }

  async componentDidMount() {
    this.getProjects();
  }


  updateState = (newState) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        ...newState
      };
    });
  }


  registrate = async (username, password) => {
    const res = await this.logic.authLogic.registrate(username, password);
    if (res["status"] === OK_STATUS) {
      this.getProjects();
      this.updateState({ "status": STATUS_LOGGED, sign_error: null });
    }
    else
      this.updateState({ sign_error: res["message"] });
  }


  logIn = async (username, password) => {
    const res = await this.logic.authLogic.logIn(username, password);
    if (res["status"] === OK_STATUS) {
      this.getProjects();
      this.updateState({ "status": STATUS_LOGGED, sign_error: null });
    }
    else
      this.updateState({ sign_error: res["message"] });

  }


  logOut = async () => {
    this.updateState({ "status": STATUS_NOT_LOGGED, sign_error: null });
  }


  getProjects = async () => {
    if (this.state.waiting) return;
    this.updateState({ waiting: true });
    const res = await this.logic.getProjects()
    if (res["status"] === OK_STATUS)
      this.updateState({ is_loaded_data: true, waiting: false })
    else
      this.updateState({ waiting: false })
  }


  addProject = async (name, notes) => {
    if (this.state.waiting) return;
    this.updateState({ waiting: true });
    const res = await this.logic.addProject(name, notes)
    if (res["status"] === OK_STATUS)
      this.updateState({ is_loaded_data: true, waiting: false })
    else
      this.updateState({ waiting: false })
  }


  changeProject = async (projectId, name, notes) => {
    if (this.state.waiting) return;
    this.updateState({ waiting: true });
    const res = await this.logic.updateProject(projectId, name, notes)
    if (res["status"] === OK_STATUS)
      this.updateState({ is_loaded_data: true, waiting: false })
    else
      this.updateState({ waiting: false })
  }


  deleteProject = async (projectId) => {
    if (this.state.waiting) return;
    this.updateState({ waiting: true });
    const res = await this.logic.deleteProject(projectId)
    if (res["status"] === OK_STATUS)
      this.updateState({ is_loaded_data: true, waiting: false })
    else
      this.updateState({ waiting: false })
  }

  openProject = async (projectId) => {
    if (this.state.waiting) return;
    this.updateState({ waiting: true });
    const res = await this.logic.openProject(projectId)
    if (res["status"] === OK_STATUS) {
      this.updateState({ is_loaded_data: true, waiting: false, page: PAGE_RADARGRAMS })
    }
    else {
      this.updateState({ waiting: false, page: PAGE_PROJECTS })
    }
  }

  closeProject = () => {
    this.updateState({ page: PAGE_PROJECTS })
  }


  deleteRadargram = async (projectId, radargramId) => {
    if (this.state.waiting) return;
    this.updateState({ waiting: true });
    const res = await this.logic.deleteRadargram(projectId, radargramId)
    if (res["status"] === OK_STATUS)
      this.updateState({ waiting: false, page: PAGE_PROJECTS })
    else
      this.updateState({ waiting: false })
  }


  getRadargramLink = async (projectId, radargramId) => {
    const res = await this.logic.getRadargramLink(projectId, radargramId)
    window.open(res.link);
  }


  addRadargram = async (projectId, formData) => {
    if (this.state.waiting) return;
    this.updateState({ waiting: true });
    const res = await this.logic.uploadRadargram(projectId, formData)
    if (res["status"] === OK_STATUS) {
      await this.openProject(projectId);
    }
    else {
      this.updateState({ waiting: false, page: PAGE_RADARGRAMS })
    }
  }



  onSelectMenuElement = (selectedKey) => {
    switch (selectedKey) {
      case "registration":
        this.updateState({ "status": STATUS_REGISTRATING });
        break
      case "enter":
        this.updateState({ "status": STATUS_ENTERING });
        break
      case "exit":
        this.logOut();
        break
      default:
        break
    }
  }


  getCurrentComponent = () => {
    switch (this.state.page) {
      case PAGE_PROJECTS:
        return (
          <Projects
            projects={this.logic.projects}
            currentProjectId={this.logic.currentProjectId}
            addProject={this.addProject}
            changeProject={this.changeProject}
            openProject={this.openProject}
            deleteProject={this.deleteProject}
          />
        )
      case PAGE_RADARGRAMS:
        return (
          <Radargrams 
            radargrams={this.logic.radargrams}
            project={this.logic.getCurrentProject()}
            closeProject={this.closeProject}
            deleteRadargram={this.deleteRadargram}
            getRadargramLink={this.getRadargramLink}
            addRadargram={this.addRadargram}
          />
        )
      default:
        break
    }
  }

  render() {
    let CurrentComponent = null;
    switch (this.state.status) {
      case STATUS_LOGGED:
        if (this.state.waiting) {
          CurrentComponent = <Welcome />
        }
        else {
          CurrentComponent = this.getCurrentComponent();
        }
        break
      case STATUS_NOT_LOGGED:
        CurrentComponent = <Welcome />
        break
      case STATUS_REGISTRATING:
        CurrentComponent = <Sign isRegistration={true} error={this.state.sign_error} onOkSign={this.registrate} onCancelSign={this.logOut} />
        break
      case STATUS_ENTERING:
        CurrentComponent = <Sign isRegistration={false} error={this.state.sign_error} onOkSign={this.logIn} onCancelSign={this.logOut} />
        break
      default:
        break
    }
    return (
      <Fragment>
        <MainMenu username={this.logic.authLogic.username} logged={this.state.status === STATUS_LOGGED} onSelectMenuElement={this.onSelectMenuElement} />
        {CurrentComponent}
      </Fragment>
    )
  }
}

export default App;
