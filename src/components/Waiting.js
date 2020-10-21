import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Jumbotron from "react-bootstrap/Jumbotron";


class Waiting extends React.Component {
    render() {
        return (
            <Jumbotron>
                <h1 style={{ textAlign: "center" }}>Загрузка данных</h1>
                <div style={{ textAlign: "center" }}>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Загрузка данных...</span>
                    </Spinner>
                </div>
            </Jumbotron>

        );
    }
}

export default Waiting;