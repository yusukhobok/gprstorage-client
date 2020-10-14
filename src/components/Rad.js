import React from "react";

// import Plot from 'react-plotly.js';
import Plotly from "plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

class Rad extends React.Component {
  render() {
    return (
      <div>
        {this.props.show && (
          <Plot
            show={this.props.show}
            data={[
              {
                //x: [10, 20, 30],
                //y: [10, 20, 30, 40, 50, 60, 70],
                z: this.props.data.Data,
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
        )}
      </div>
    );
  }
}

export default Rad;
