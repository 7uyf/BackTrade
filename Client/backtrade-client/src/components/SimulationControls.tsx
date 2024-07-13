import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  PlayCircleFilled,
} from "@mui/icons-material";
import { Button, IconButton, Paper, Slider } from "@mui/material";
import React from "react";
import "./SimulationControls.css";
import "../index.css";

class SimulationControls extends React.Component {
  render(): React.ReactNode {
    return (
      <Paper className="controls-card even-margin">
        <div style={{ color: "white" }}>Simulation Controls</div>
        <div>
          <div className="panel">
            <div>
              <IconButton className="speed-control-button">
                <KeyboardDoubleArrowLeft className="speed-control-icon" />
              </IconButton>
              <IconButton className="speed-control-button">
                <KeyboardArrowLeft className="speed-control-icon" />
              </IconButton>
              <IconButton className="speed-control-button">
                <PlayCircleFilled className="speed-control-icon" />
              </IconButton>
              <IconButton className="speed-control-button">
                <KeyboardArrowRight className="speed-control-icon" />
              </IconButton>
              <IconButton className="speed-control-button">
                <KeyboardDoubleArrowRight className="speed-control-icon" />
              </IconButton>
            </div>
            <div className="slider-container">
              <Slider
                defaultValue={50}
                track={false}
                aria-label="Default"
                valueLabelDisplay="auto"
              />
            </div>
            <div>
              <Button className="finish-button" variant="contained">
                Finish
              </Button>
              <Button className="restart-button" variant="contained">
                Restart
              </Button>
            </div>
          </div>
          <div className="time-slider">
            <Slider
              defaultValue={0}
              aria-label="Default"
              valueLabelDisplay="auto"
            />
          </div>
        </div>
      </Paper>
    );
  }
}

export default SimulationControls;
