import AuthLogic from "./AuthLogic";
import {API_URL, OK_STATUS, ERROR_STATUS} from "../Global";
import axios from "axios";

class Logic {
    constructor() {
        this.authLogic = new AuthLogic();
        this.projects = [];
        this.currentProjectId = null;
        this.radargrams = [];
    }

    getCurrentProject() {
        console.log(this.currentProjectId);
        if (this.currentProjectId === null)
          return null;
        else {
          const project = this.projects.find(item => item.id === this.currentProjectId)
          if (project === undefined)
            return null;
          else
            return project;
        }
    }

    async openProject(projectId) {
        try {
            if (!this.authLogic.authorized) return {"status": ERROR_STATUS, "message": "Пользователь не авторизован"}
            if (this.projects.length === 0) return {"status": ERROR_STATUS, "message": "Нет ни одного проекта"}
            const res = await axios.get(`${API_URL}/projects/${projectId}/radargrams`, this.authLogic.getAuth());
            this.setRadargrams(res.data.radargrams);
            this.currentProjectId = projectId;
            return ({"status": OK_STATUS, "message": "Операция завершилась успешно"});
        }
        catch (error) {
            return {"status": ERROR_STATUS, "message": error.message}
        }
    }

    async getProjects() {
        try {
            if (!this.authLogic.authorized) return {"status": ERROR_STATUS, "message": "Пользователь не авторизован"}
            console.log(this.authLogic.getAuth());
            const res = await axios.get(`${API_URL}/projects`, this.authLogic.getAuth());
            console.log("getProjects", res);
            this.projects = res.data.projects;
            this.projects.sort((pr1, pr2) => pr1.id - pr2.id)
            this.currentProjectId = null
            return ({"status": OK_STATUS, "message": "Операция завершилась успешно", "projects": this.projects});
        }
        catch (error) {
            return {"status": ERROR_STATUS, "message": error.message}
        }
    }

    async getProjectById(projectId) {
        try {
            if (!this.authLogic.authorized) return {"status": ERROR_STATUS, "message": "Пользователь не авторизован"}
            const res = await axios.get(`${API_URL}/projects/${projectId}`, this.authLogic.getAuth());
            console.log(res);
            return ({"status": OK_STATUS, "message": "Операция завершилась успешно", "project": res.data.project});
        }
        catch (error) {
            return {"status": ERROR_STATUS, "message": error.message}
        }
    }

    async addProject(name, notes) {
        try {
            if (!this.authLogic.authorized) return {"error": "Пользователь не авторизован"}
            const res = await axios.post(`${API_URL}/projects`, { name, notes }, this.authLogic.getAuth());
            await this.getProjects();
            console.log(res);
            return ({"status": OK_STATUS, "message": "Операция завершилась успешно", "project": res.data.project});

        }
        catch (error) {
            return {"status": ERROR_STATUS, "message": error.message}
        }
    }

    async updateProject(projectId, name, notes) {
        try {
            if (!this.authLogic.authorized) return {"error": "Пользователь не авторизован"}
            const res = await axios.put(`${API_URL}/projects/${projectId}`, { name, notes }, this.authLogic.getAuth());            
            await this.getProjects();
            return ({"status": OK_STATUS, "message": "Операция завершилась успешно", "project": res.data.project});
        }
        catch (error) {
            return {"status": ERROR_STATUS, "message": error.message}
        }
    }

    async deleteProject(projectId) {
        try {
            if (!this.authLogic.authorized) return {"error": "Пользователь не авторизован"}
            const res = await axios.delete(`${API_URL}/projects/${projectId}`, this.authLogic.getAuth());
            await this.getProjects();
            console.log(res);
            return ({"status": OK_STATUS, "message": "Операция завершилась успешно"});
        }
        catch (error) {
            return {"status": ERROR_STATUS, "message": error.message}
        }
    }

    async getRadargramLink(projectId, radargramId) {
        try {
            if (!this.authLogic.authorized) return {"error": "Пользователь не авторизован"}
            const res = await axios.get(`${API_URL}/projects/${projectId}/radargrams/${radargramId}/link`, this.authLogic.getAuth());
            return ({"status": OK_STATUS, "message": "Операция завершилась успешно", "link": res.data});
        }
        catch (error) {
            return {"status": ERROR_STATUS, "message": error.message}
        }
    }

    async deleteRadargram(projectId, radargramId) {
        try {
            if (!this.authLogic.authorized) return {"error": "Пользователь не авторизован"}
            const res = await axios.delete(`${API_URL}/projects/${projectId}/radargrams/${radargramId}`, this.authLogic.getAuth());
            console.log(res);
            return ({"status": OK_STATUS, "message": "Операция завершилась успешно"});
        }
        catch (error) {
            return {"status": ERROR_STATUS, "message": error.message}
        }
    }

    setRadargrams(radargrams) {
        this.radargrams = radargrams;
        this.radargrams.sort((rad1, rad2) => rad1.id - rad2.id)
    }


    async getTraces(projectId, radargramId, startNum, finishNum, stage) {
        try {
            if (!this.authLogic.authorized) return {"status": ERROR_STATUS, "message": "Пользователь не авторизован"}
            const res = await axios.get(`${API_URL}/projects/${projectId}/radargrams/${radargramId}/traces/amplitudes/${startNum}/${finishNum}/${stage}`, this.authLogic.getAuth());
            console.log("getTraces", res);
            return ({"status": OK_STATUS, "message": "Операция завершилась успешно"});
        }
        catch (error) {
            return {"status": ERROR_STATUS, "message": error.message}
        }
    }

}

export default Logic;