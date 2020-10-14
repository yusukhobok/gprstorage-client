import "bootstrap/dist/css/bootstrap.min.css";
import React, { Fragment } from "react";

import MainMenu from "./components/MainMenu";
// import Rad from "./components/Rad";
// import ProjectOptions from "./components/ProjectOptions";
import Sign from "./components/Sign";
import Welcome from "./components/Welcome";

import axios from "axios";


const API_URL = "https://gprstorage-stage.herokuapp.com/api";

const STATUS_NOT_LOGGED = "STATUS_NOT_LOGGED"
const STATUS_REGISTRATING = "STATUS_REGISTRATING"
const STATUS_ENTERING = "STATUS_ENTERING"
const STATUS_LOGGED = "STATUS_LOGGED"


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      status: STATUS_LOGGED, //STATUS_NOT_LOGGED,
      username: "yuri", //null,
      sign_error: null,

      waiting: false,
      projects: [],
      currentProjectId: null,
      radaragrams: [],
      currentRadargramId: null,
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


  registrate = async (username, password) => {
    try {
      await axios.post(`${API_URL}/users/registration`, { username, password });
      this.updateState({ "status": STATUS_LOGGED, username, sign_error: null })
      console.log(this.state);
    }
    catch (error) {
      console.log(error.message);
      this.updateState({ sign_error: "Пользователь с таким именем уже зарегистрирован" })
    }
  }


  logIn = async (username, password) => {
    try {
      const res = await axios.post(`${API_URL}/users/signin`, { username, password });
      console.log(res);
      this.updateState({ "status": STATUS_LOGGED, username, sign_error: null })
      console.log(this.state);
    }
    catch (error) {
      console.log(error.message);
      this.updateState({ sign_error: "Имя пользователя или пароль введены неверно" })
    }
  }


  logOut = async () => {
    this.updateState({ "status": STATUS_NOT_LOGGED, username: null, sign_error: null })
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


  render() {
    let CurrentComponent = null;
    switch (this.state.status) {
      case STATUS_LOGGED:
        CurrentComponent = <p>Let's start working!</p> //<Main />
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

        <MainMenu username={this.state.username} logged={this.state.status === STATUS_LOGGED} onSelectMenuElement={this.onSelectMenuElement} />
        {CurrentComponent}


      </Fragment>
    )
  }
}

export default App;
