// import {
//   KeyboardArrowLeft,
//   KeyboardArrowRight,
//   KeyboardDoubleArrowLeft,
//   KeyboardDoubleArrowRight,
//   PlayCircleFilled,
// } from "@mui/icons-material";
// import { Button, IconButton, Paper, Slider } from "@mui/material";
// import React from "react";
// import "./SimulationControls.css";
// import IconText from "./IconText";

// class SimulationControls extends React.Component {
//   render(): React.ReactNode {
//     return (
//       <Paper className="simulator-controls">
//         <IconText text="Simulation Controls" />
//         <div>
//           <div className="panel">
//             <div>
//               <IconButton className="speed-control-button">
//                 <KeyboardDoubleArrowLeft className="speed-control-icon" />
//               </IconButton>
//               <IconButton className="speed-control-button">
//                 <KeyboardArrowLeft className="speed-control-icon" />
//               </IconButton>
//               <IconButton className="speed-control-button">
//                 <PlayCircleFilled className="speed-control-icon" />
//               </IconButton>
//               <IconButton className="speed-control-button">
//                 <KeyboardArrowRight className="speed-control-icon" />
//               </IconButton>
//               <IconButton className="speed-control-button">
//                 <KeyboardDoubleArrowRight className="speed-control-icon" />
//               </IconButton>
//             </div>
//             <div className="slider-container">
//               <Slider
//                 defaultValue={50}
//                 track={false}
//                 aria-label="Default"
//                 valueLabelDisplay="auto"
//               />
//             </div>
//             <div>
//               <Button className="finish-button" variant="contained">
//                 Finish
//               </Button>
//               <Button className="restart-button" variant="contained">
//                 Restart
//               </Button>
//             </div>
//           </div>
//           <div className="time-slider">
//             <Slider
//               defaultValue={0}
//               aria-label="Default"
//               valueLabelDisplay="auto"
//             />
//           </div>
//         </div>
//       </Paper>
//     );
//   }
// }

// export default SimulationControls;

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
import IconText from "./IconText";

interface SimulationControlsProps {
  scale?: number;
}

class SimulationControls extends React.Component<SimulationControlsProps> {
  render(): React.ReactNode {
    const { scale = 1 } = this.props; // שימוש בפרופ `scale` עם ערך ברירת מחדל של 1

    return (
      <Paper
        className="simulator-controls"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        <IconText text="Simulation Controls" iconSize="20px" textSize="18px" />
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
