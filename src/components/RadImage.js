import React from "react";

// import Plot from 'react-plotly.js';
import Plotly from "plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

class RadImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // name: "",
            // notes: "",
            // isOpenOptions: false,
            // currentProjectId: null,
            // isAddNewProject: false,
        };
    }

    clearState = () => {
        this.updateState({
            // name: "",
            // notes: "",
            // isOpenOptions: false,
            // currentProjectId: null,
            // isAddNewProject: false,
        });
    }

    render() {
        return (
            <Plot
                show={this.props.show}
                data={[
                    {
                        //x: [10, 20, 30],
                        //y: [10, 20, 30, 40, 50, 60, 70],
                        //z: [[1,2,3], [4,5,6], [7,8,9]],//this.props.data.Data,
                        z: this.props.amplitudes,
                        type: "heatmap",
                    },
                ]}
                layout={{
                    autosize: true,
                    yaxis: { autorange: "reversed", title: { text: "Samples" } },
                    xaxis: { title: { text: "Traces" } },
                }}
                useResizeHandler={true}
                config={{
                    // displayModeBar: false,
                    scrollZoom: true,
                    responsive: true,
                }}
                style={{ width: "100vw", height: "75vh" }}
            />


        )
    }
}

export default RadImage;