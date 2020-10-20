import axios from "axios";

import {API_URL, OK_STATUS, ERROR_STATUS} from "../Global";

class AuthLogic {
    constructor() {
        this.authorized = true; //false;
        this.username = "yuri"; //"";
        this.password = "123"; //"";
    }

    getAuth() {
        return { auth: { username: this.username, password: this.password } }
    }

    async registrate(username, password) {
        try {
            const res = await axios.post(`${API_URL}/users/registration`, { username, password });
            console.log("registrate", res);
            this.authorized = true;
            this.username = username;
            this.password = password;
            return {"status": OK_STATUS, "message": "Регистрация выполнена успешно"}
        }
        catch (error) {
            console.log(error.message);
            return {"status": ERROR_STATUS, "message": "Пользователь с таким именем уже зарегистрирован"}
        }
    }


    async logIn(username, password) {
        try {
            const res = await axios.post(`${API_URL}/users/signin`, { username, password });
            console.log("logIn", res);
            this.authorized = true;
            this.username = username;
            this.password = password;
            return {"status": OK_STATUS, "message": "Регистрация выполнена успешно"}
        }
        catch (error) {
            console.log(error.message);
            return {"status": ERROR_STATUS, "message": "Имя пользователя или пароль введены неверно"}
        }
    }


    logOut() {
        this.authorized = false;
        this.username = "";
        this.password = "";
    }

}

export default AuthLogic;