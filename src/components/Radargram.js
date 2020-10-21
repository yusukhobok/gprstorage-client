import React from "react";

import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import RadImage from "./RadImage";


class Radargram extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amplitudes: null
        };
    }

    clearState = () => {
        this.updateState({
            amplitudes: null
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

    deleteRadargram = async () => {
        const projectId = this.props.project.id;
        const radargramId = this.props.radargram.id;
        await this.props.deleteRadargram(projectId, radargramId);
    }

    getRadargramLink = async () => {
        const projectId = this.props.project.id;
        const radargramId = this.props.radargram.id;
        await this.props.getRadargramLink(projectId, radargramId);
    }

    onCollapseRadargram = async () => {
        console.log(this.state.amplitudes);
        if (this.state.amplitudes !== null) return;
        const projectId = this.props.project.id;
        const radargramId = this.props.radargram.id;
        const startNum = 0;
        const finishNum = this.props.radargram.traces_count;
        const stage = Math.ceil(this.props.radargram.traces_count / this.props.tracesCountOnPage);
        const res = await this.props.getTraces(projectId, radargramId, startNum, finishNum, stage)
        console.log(res);
        this.updateState({
            amplitudes: res.amplitudes
        });
    }

    render() {
        return (

            <Accordion>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            Параметры
                              </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Параметр</th>
                                        <th>Значение</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr> <td>Название</td> <td>{this.props.radargram.name}</td> </tr>
                                    <tr> <td>Комментарии</td> <td>{this.props.radargram.notes}</td> </tr>
                                    <tr> <td>Шаг сканирования, м</td> <td>{this.props.radargram.stage_between_traces}</td> </tr>
                                    <tr> <td>Временная развертка, нс</td> <td>{this.props.radargram.time_base}</td> </tr>
                                    <tr> <td>Количество трасс</td> <td>{this.props.radargram.traces_count}</td> </tr>
                                    <tr> <td>Количество временных отсчетов</td> <td>{this.props.radargram.samples_count}</td> </tr>
                                    <tr> <td>Расстояние между антеннами, м</td> <td>{this.props.radargram.distance_between_antennas}</td> </tr>
                                    <tr> <td>Модель георадара</td> <td>{this.props.radargram.GPR_unit}</td> </tr>
                                    <tr> <td>Антенна</td> <td>{this.props.radargram.antenna_name}</td> </tr>
                                    <tr> <td>Центральная частота, МГц</td> <td>{this.props.radargram.frequency}</td> </tr>
                                    <tr> <td>Дата создания</td> <td>{this.props.radargram.creation_datetime}</td> </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1" onClick={this.onCollapseRadargram}>
                            Радарограмма
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            <RadImage
                                project={this.props.project}
                                radargram={this.props.radargram}
                                amplitudes={this.state.amplitudes}
                            />
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="2">
                            Действия
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="2">
                        <Card.Body>
                            <p><a href="#delete" onClick={this.deleteRadargram}>Удалить радарограмму</a></p>
                            <p><a href="#download" onClick={this.getRadargramLink}>Скачать радарограмму</a></p>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        );
    }
}

export default Radargram;