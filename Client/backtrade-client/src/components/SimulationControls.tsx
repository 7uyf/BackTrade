import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
  PlayCircleFilled,
} from "@mui/icons-material";
import {
  Button,
  IconButton,
  Paper,
  Slider,
  TextField,
  Popover,
} from "@mui/material";
import React, { createRef, RefObject } from "react";
import "./SimulationControls.css";
import IconText from "./IconText";

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
  hour: number;
  minute: number;
  minHour: number;
  maxHour: number;
  popoverOpen: boolean;
  anchorEl: HTMLElement | null;
  inputHour: number;
  inputMinute: number;
  isValidTime: boolean;
}

class SimulationControls extends React.Component<
  SimulationControlsProps,
  SimulationControlsState
> {
  minuteInputRef: RefObject<HTMLInputElement>;

  constructor(props: SimulationControlsProps) {
    super(props);
    this.minuteInputRef = createRef();
  }

  state: SimulationControlsState = {
    times: [],
    currentTimeIndex: 0,
    speed: 1,
    isPlaying: true,
    hour: 14, // NYSE starts at 14:30 UTC
    minute: 30,
    minHour: 14,
    maxHour: 21,
    popoverOpen: false,
    anchorEl: null,
    inputHour: 14,
    inputMinute: 30,
    isValidTime: true,
  };

  componentDidMount() {
    const times = this.generateNYSEOpenTimes();
    const minHour = parseInt(times[0].split(":")[0], 10);
    const maxHour = parseInt(times[times.length - 1].split(":")[0], 10);
    this.setState({ times, minHour, maxHour, hour: minHour });
  }

  generateNYSEOpenTimes = (): string[] => {
    const nyseOpenTimeUTC = new Date(Date.UTC(1970, 0, 1, 14, 30)); // NYSE opens at 14:30 UTC
    const nyseCloseTimeUTC = new Date(Date.UTC(1970, 0, 1, 21, 0)); // NYSE closes at 21:00 UTC

    const result: string[] = [];
    let currentTime = nyseOpenTimeUTC;

    while (currentTime <= nyseCloseTimeUTC) {
      const formattedTime = this.formatTime(currentTime);
      result.push(formattedTime);
      currentTime.setMinutes(currentTime.getMinutes() + 1);
    }

    return result;
  };

  formatTime = (time: Date): string => {
    const localTime = new Date(time.getTime());
    const formattedTime = localTime.toTimeString().split(" ")[0];
    return formattedTime;
  };

  handleSliderChange = (event: Event, newValue: number | number[]): void => {
    const timeIndex = newValue as number;
    const [hour, minute] = this.state.times[timeIndex].split(":").map(Number);
    this.setState({ currentTimeIndex: timeIndex, hour, minute });
  };

  handleSliderChangeCommitted = (
    event: React.SyntheticEvent | Event,
    newValue: number | number[]
  ): void => {
    const timeIndex = newValue as number;
    const [hour, minute] = this.state.times[timeIndex].split(":").map(Number);
    this.setState({ currentTimeIndex: timeIndex, hour, minute });
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
    const [hour, minute] = this.state.times[newIndex].split(":").map(Number);
    this.setState({ currentTimeIndex: newIndex, hour, minute });
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

  handleClockClick = (event: React.MouseEvent<HTMLElement>) => {
    this.setState(
      {
        popoverOpen: true,
        anchorEl: event.currentTarget,
        inputHour: this.state.hour,
        inputMinute: this.state.minute,
      },
      this.validateTime
    );
  };

  handlePopoverClose = () => {
    this.setState({
      popoverOpen: false,
      anchorEl: null,
    });
  };

  handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputHour = parseInt(event.target.value, 10);
    this.setState({ inputHour }, () => {
      this.validateTime();
      if (
        event.target.value.length === 2 &&
        inputHour >= this.state.minHour &&
        inputHour <= this.state.maxHour &&
        this.minuteInputRef.current
      ) {
        this.minuteInputRef.current.focus();
        this.minuteInputRef.current.select();
      }
    });
  };

  handleMinuteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputMinute = parseInt(event.target.value, 10);
    this.setState({ inputMinute }, this.validateTime);
  };

  validateTime = () => {
    const { inputHour, inputMinute, minHour, maxHour, times } = this.state;
    const timeString = `${String(inputHour).padStart(2, "0")}:${String(
      inputMinute
    ).padStart(2, "0")}:00`;
    const isValidTime =
      times.includes(timeString) &&
      inputHour >= minHour &&
      inputHour <= maxHour &&
      inputMinute >= 0 &&
      inputMinute <= 59;
    this.setState({ isValidTime });
  };

  handlePopoverOk = () => {
    const { inputHour, inputMinute, times, isValidTime } = this.state;
    if (isValidTime) {
      const timeString = `${String(inputHour).padStart(2, "0")}:${String(
        inputMinute
      ).padStart(2, "0")}:00`;
      const timeIndex = times.indexOf(timeString);
      if (timeIndex !== -1) {
        this.setState({
          hour: inputHour,
          minute: inputMinute,
          currentTimeIndex: timeIndex,
          popoverOpen: false,
          anchorEl: null,
        });
        this.props.onTimeChange(timeIndex);
      } else {
        this.handlePopoverClose();
      }
    }
  };

  handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      this.handlePopoverOk();
    }
  };

  render(): React.ReactNode {
    const {
      times,
      currentTimeIndex,
      speed,
      hour,
      minute,
      minHour,
      maxHour,
      popoverOpen,
      anchorEl,
      inputHour,
      inputMinute,
      isValidTime,
    } = this.state;
    const speedMarks = [
      { value: 1, label: "1x" },
      { value: 2, label: "2x" },
      { value: 3, label: "3x" },
      { value: 4, label: "4x" },
      { value: 5, label: "5x" },
      { value: 10, label: "10x" },
    ];

    return (
      <Paper className="simulator-controls">
        <IconText text="Simulation Controls" />
        <div>
          <div className="panel">
            <div className="clock-display" onClick={this.handleClockClick}>
              <span className="clock-time">
                {String(hour).padStart(2, "0")}:
                {String(minute).padStart(2, "0")}
              </span>
            </div>
            <Popover
              open={popoverOpen}
              anchorEl={anchorEl}
              onClose={this.handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              className="popover-content"
            >
              <div className="popover-content">
                <TextField
                  type="number"
                  value={inputHour}
                  onChange={this.handleHourChange}
                  onKeyPress={this.handleKeyPress}
                  inputProps={{ min: minHour, max: maxHour }}
                  style={{ width: 60 }}
                  className={!isValidTime ? "invalid-input" : ""}
                />
                <span className="colon">:</span>
                <TextField
                  type="number"
                  value={inputMinute}
                  onChange={this.handleMinuteChange}
                  onKeyPress={this.handleKeyPress}
                  inputProps={{ min: 0, max: 59 }}
                  style={{ width: 60 }}
                  className={!isValidTime ? "invalid-input" : ""}
                  inputRef={this.minuteInputRef}
                />
                <Button
                  onClick={this.handlePopoverOk}
                  className="change-button"
                  disabled={!isValidTime}
                  style={{ backgroundColor: "transparent" }}
                >
                  Change
                </Button>
              </div>
            </Popover>
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
              onChangeCommitted={this.handleSliderChangeCommitted}
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
