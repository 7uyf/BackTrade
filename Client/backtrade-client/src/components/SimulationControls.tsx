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

interface SimulationControlsProps {
  onSpeedChange: (speed: number) => void;
  onTimeChange: (timeIndex: number) => void;
  onFinish: () => void;
  onRestart: () => void;
  onPause: () => void;
  onResume: () => void;
}

interface SimulationControlsState {
  times: string[];
  currentTimeIndex: number;
  speed: number;
  isPlaying: boolean;
}

class SimulationControls extends React.Component<
  SimulationControlsProps,
  SimulationControlsState
> {
  state: SimulationControlsState = {
    times: [],
    currentTimeIndex: 0,
    speed: 1,
    isPlaying: true,
  };

  componentDidMount() {
    const times = this.generateNYSEOpenTimes();
    this.setState({ times });
  }

  generateNYSEOpenTimes = (): string[] => {
    const nyseOpenTimeUTC = new Date(Date.UTC(1970, 0, 1, 14, 30)); // NYSE opens at 14:30 UTC
    const nyseCloseTimeUTC = new Date(Date.UTC(1970, 0, 1, 21, 0)); // NYSE closes at 21:00 UTC

    const result: string[] = [];
    let currentTime = nyseOpenTimeUTC;

    while (currentTime <= nyseCloseTimeUTC) {
      const localTime = new Date(currentTime.getTime());
      const formattedTime = localTime.toTimeString().split(" ")[0];
      result.push(formattedTime);
      currentTime.setMinutes(currentTime.getMinutes() + 1);
    }

    return result;
  };

  handleSliderChange = (event: Event, newValue: number | number[]): void => {
    const timeIndex = newValue as number;
    this.setState({ currentTimeIndex: timeIndex });
    this.props.onTimeChange(timeIndex);
  };

  handleSpeedChange = (event: Event, newValue: number | number[]): void => {
    const speed = newValue as number;
    this.setState({ speed });
    const isPlaying = this.state.isPlaying ? 1 : 0;
    this.props.onSpeedChange(speed * isPlaying);
  };

  handleSkip = (minutes: number) => {
    const newIndex = Math.min(
      Math.max(this.state.currentTimeIndex + minutes, 0),
      this.state.times.length - 1
    );
    this.setState({ currentTimeIndex: newIndex });
    this.props.onTimeChange(newIndex);
  };

  handlePlayPause = () => {
    const isPlaying = !this.state.isPlaying;
    this.setState({ isPlaying });
    if (isPlaying) {
      this.props.onResume()
    } else {
      this.props.onPause()
    }
  };

  render(): React.ReactNode {
    const { times, currentTimeIndex, speed } = this.state;
    const speedMarks = [
      { value: 1, label: "1x" },
      { value: 2, label: "2x" },
      { value: 3, label: "3x" },
      { value: 4, label: "4x" },
      { value: 5, label: "5x" },
      { value: 10, label: "10x" },
    ];

    return (
      <Paper className="controls-card even-margin">
        <div style={{ color: "white" }}>Simulation Controls</div>
        <div>
          <div className="panel">
            <div>
              <IconButton
                className="speed-control-button"
                onClick={() => this.handleSkip(-60)}
              >
                <KeyboardDoubleArrowLeft className="speed-control-icon" />
              </IconButton>
              <IconButton
                className="speed-control-button"
                onClick={() => this.handleSkip(-5)}
              >
                <KeyboardArrowLeft className="speed-control-icon" />
              </IconButton>
              <IconButton
                className="speed-control-button"
                onClick={this.handlePlayPause}
              >
                <PlayCircleFilled className="speed-control-icon" />
              </IconButton>
              <IconButton
                className="speed-control-button"
                onClick={() => this.handleSkip(5)}
              >
                <KeyboardArrowRight className="speed-control-icon" />
              </IconButton>
              <IconButton
                className="speed-control-button"
                onClick={() => this.handleSkip(60)}
              >
                <KeyboardDoubleArrowRight className="speed-control-icon" />
              </IconButton>
            </div>
            <div className="slider-container">
              <Slider
                defaultValue={1}
                value={speed}
                onChange={this.handleSpeedChange}
                step={null}
                marks={speedMarks}
                min={1}
                max={10}
                aria-label="Speed Slider"
                valueLabelDisplay="auto"
              />
            </div>
            <div>
              <Button
                className="finish-button"
                variant="contained"
                onClick={this.props.onFinish}
              >
                Finish
              </Button>
              <Button
                className="restart-button"
                variant="contained"
                onClick={this.props.onRestart}
              >
                Restart
              </Button>
            </div>
          </div>
          <div className="time-slider">
            <Slider
              defaultValue={0}
              value={currentTimeIndex}
              onChange={this.handleSliderChange}
              max={times.length - 1}
              aria-label="Time Slider"
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => times[value] || ""}
            />
          </div>
        </div>
      </Paper>
    );

  }
}



export default SimulationControls;
