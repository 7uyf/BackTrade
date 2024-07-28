import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import "./Simulator.css";
import SimulationControls from "../components/SimulationControls";
import Indicators from "../components/Indicators";
import OrderEntry from "../components/OrderEntry/OrderEntry";
import SimulationBuilder from "../components/SimulationBuilder";
import OptionChain from "../components/OptionChain";
import { DtePortfolioData, OptionChainData } from "../types";
import Portfolio from "../components/Portfolio";

const optionChainMock: OptionChainData[] = [
  {
    dte: "2024-07-30",
    symbol: "QQQ",
    callBid: 0.5,
    callAsk: 100,
    callVega: 150,
    callDelta: "10",
    callGamma: 1.2,
    callTheta: 1.3,
    callIV: "15",
    strike: 150,
    putBid: -0.5,
    putAsk: 200,
    putVega: 100,
    putDelta: "12",
    putGamma: 1.1,
    putTheta: 1.2,
    putIV: "14",
  },
  {
    dte: "2024-07-30",
    symbol: "QQQ",
    callBid: 0.5,
    callAsk: 100,
    callVega: 150,
    callDelta: "10",
    callGamma: 1.2,
    callTheta: 1.3,
    callIV: "15",
    strike: 150,
    putBid: -0.5,
    putAsk: 200,
    putVega: 100,
    putDelta: "12",
    putGamma: 1.1,
    putTheta: 1.2,
    putIV: "14",
  },
  {
    dte: "2024-07-30",
    symbol: "QQQ",
    callBid: 0.5,
    callAsk: 100,
    callVega: 150,
    callDelta: "10",
    callGamma: 1.2,
    callTheta: 1.3,
    callIV: "15",
    strike: 150,
    putBid: -0.5,
    putAsk: 200,
    putVega: 100,
    putDelta: "12",
    putGamma: 1.1,
    putTheta: 1.2,
    putIV: "14",
  },
  {
    dte: "2024-07-30",
    symbol: "QQQ",
    callBid: 0.5,
    callAsk: 100,
    callVega: 150,
    callDelta: "10",
    callGamma: 1.2,
    callTheta: 1.3,
    callIV: "15",
    strike: 150,
    putBid: -0.5,
    putAsk: 200,
    putVega: 100,
    putDelta: "12",
    putGamma: 1.1,
    putTheta: 1.2,
    putIV: "14",
  },
  {
    dte: "2024-07-30",
    symbol: "QQQ",
    callBid: 0.5,
    callAsk: 100,
    callVega: 150,
    callDelta: "10",
    callGamma: 1.2,
    callTheta: 1.3,
    callIV: "15",
    strike: 150,
    putBid: -0.5,
    putAsk: 200,
    putVega: 100,
    putDelta: "12",
    putGamma: 1.1,
    putTheta: 1.2,
    putIV: "14",
  },
  {
    dte: "2024-07-30",
    symbol: "QQQ",
    callBid: 0.4,
    callAsk: 10,
    callVega: 140,
    callDelta: "90",
    callGamma: 1.4,
    callTheta: 1.5,
    callIV: "13",
    strike: 140,
    putBid: -0.6,
    putAsk: 200,
    putVega: 110,
    putDelta: "14",
    putGamma: 1.3,
    putTheta: 1.6,
    putIV: "13",
  },
  {
    dte: "2024-07-30",
    symbol: "QQQ",
    callBid: 0.7,
    callAsk: 105,
    callVega: 140,
    callDelta: "9",
    callGamma: 1.4,
    callTheta: 1.6,
    callIV: "14",
    strike: 140,
    putBid: -0.2,
    putAsk: 180,
    putVega: 110,
    putDelta: "11",
    putGamma: 1.3,
    putTheta: 1,
    putIV: "15",
  },
  {
    dte: "2024-08-30",
    symbol: "SPY",
    callBid: 0.9,
    callAsk: 110,
    callVega: 130,
    callDelta: "9",
    callGamma: 1.9,
    callTheta: 1.6,
    callIV: "14",
    strike: 140,
    putBid: -0.4,
    putAsk: 190,
    putVega: 90,
    putDelta: "11",
    putGamma: 1.3,
    putTheta: 1.2,
    putIV: "14",
  },
  {
    dte: "2024-08-30",
    symbol: "QQQ",
    callBid: 0.5,
    callAsk: 100,
    callVega: 150,
    callDelta: "10",
    callGamma: 1.2,
    callTheta: 1.3,
    callIV: "15",
    strike: 150,
    putBid: -0.5,
    putAsk: 200,
    putVega: 100,
    putDelta: "12",
    putGamma: 1.1,
    putTheta: 1.2,
    putIV: "14",
  },
  {
    dte: "2024-09-30",
    symbol: "SPY",
    callBid: 0.5,
    callAsk: 100,
    callVega: 150,
    callDelta: "10",
    callGamma: 1.2,
    callTheta: 1.3,
    callIV: "15",
    strike: 150,
    putBid: -0.5,
    putAsk: 200,
    putVega: 100,
    putDelta: "12",
    putGamma: 1.1,
    putTheta: 1.2,
    putIV: "14",
  },

  // Add more data for other symbols if needed...
];

const portfolioMock: DtePortfolioData[] = [
  {
    dte: "2024-07-30",
    values: [
      {
        dailyPnl: 100,
        instrument: {
          symbol: "AAPL",
          expirationDate: "2024-08-30",
          strike: 150,
          right: "Call",
        },
        position: 10,
        marketValue: 5000,
        delta: 0.5,
        gamma: 0.1,
        vega: 0.2,
        avgPrice: 145,
        last: 150,
      },
      {
        dailyPnl: -50,
        instrument: {
          symbol: "GOOGL",
          expirationDate: "2024-08-30",
          strike: 2500,
          right: "Put",
        },
        position: 5,
        marketValue: 3000,
        delta: -0.4,
        gamma: 0.05,
        vega: 0.15,
        avgPrice: 2550,
        last: 2500,
      },
      {
        dailyPnl: 200,
        instrument: {
          symbol: "TSLA",
          expirationDate: "2024-08-30",
          strike: 700,
          right: "Call",
        },
        position: 2,
        marketValue: 1400,
        delta: 0.7,
        gamma: 0.12,
        vega: 0.25,
        avgPrice: 690,
        last: 700,
      },
    ],
  },
  {
    dte: "2024-08-30",
    values: [
      {
        dailyPnl: 120,
        instrument: {
          symbol: "MSFT",
          expirationDate: "2024-09-30",
          strike: 300,
          right: "Call",
        },
        position: 15,
        marketValue: 4500,
        delta: 0.6,
        gamma: 0.08,
        vega: 0.22,
        avgPrice: 290,
        last: 300,
      },
      {
        dailyPnl: -30,
        instrument: {
          symbol: "NFLX",
          expirationDate: "2024-09-30",
          strike: 500,
          right: "Put",
        },
        position: 7,
        marketValue: 2100,
        delta: -0.3,
        gamma: 0.06,
        vega: 0.18,
        avgPrice: 520,
        last: 500,
      },
      {
        dailyPnl: 180,
        instrument: {
          symbol: "AMZN",
          expirationDate: "2024-09-30",
          strike: 3500,
          right: "Call",
        },
        position: 3,
        marketValue: 9000,
        delta: 0.65,
        gamma: 0.1,
        vega: 0.3,
        avgPrice: 3450,
        last: 3500,
      },
    ],
  },
  {
    dte: "2024-09-30",
    values: [
      {
        dailyPnl: 90,
        instrument: {
          symbol: "FB",
          expirationDate: "2024-10-30",
          strike: 350,
          right: "Call",
        },
        position: 8,
        marketValue: 2800,
        delta: 0.55,
        gamma: 0.07,
        vega: 0.2,
        avgPrice: 340,
        last: 350,
      },
      {
        dailyPnl: -10,
        instrument: {
          symbol: "NVDA",
          expirationDate: "2024-10-30",
          strike: 600,
          right: "Put",
        },
        position: 6,
        marketValue: 3600,
        delta: -0.45,
        gamma: 0.09,
        vega: 0.25,
        avgPrice: 610,
        last: 600,
      },
      {
        dailyPnl: 250,
        instrument: {
          symbol: "BABA",
          expirationDate: "2024-10-30",
          strike: 200,
          right: "Call",
        },
        position: 4,
        marketValue: 800,
        delta: 0.75,
        gamma: 0.15,
        vega: 0.35,
        avgPrice: 190,
        last: 200,
      },
    ],
  },
];

const Simulator: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionChainData | null>(
    null
  );
  const [selectedOptionAction, setSelectedOptionAction] = useState<
    "Call" | "Put" | null
  >(null);

  useEffect(() => {
    handleClickOpen();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSimulationStart = () => {
    setOpen(false); // Close the dialog when simulation starts
  };

  const handleOptionSelect = (
    option: OptionChainData,
    actionType: "Call" | "Put"
  ) => {
    setSelectedOption(option);
    setSelectedOptionAction(actionType);
  };

  const handleSpeedChange = (speed: number) => {
    console.log("handleSpeedChange", speed);
    // TODO: Connect to backend to change the simulation speed
  };

  const handleTimeChange = (timeIndex: number) => {
    console.log("handleTimeChange", timeIndex);
    // TODO: Connect to backend to change the current simulation time
  };

  const handleFinish = () => {
    console.log("handleFinish");
    // TODO: Connect to backend to finish the simulation
  };

  const handleRestart = () => {
    console.log("handleRestart");
    // TODO: Connect to backend to restart the simulation
  };

  return (
    <div className="mainDiv mainDiv-scale">
      <div className="UpDiv">
        <SimulationControls
          onSpeedChange={handleSpeedChange}
          onTimeChange={handleTimeChange}
          onFinish={handleFinish}
          onRestart={handleRestart}
        />
        <OptionChain
          title="Option Chain"
          values={optionChainMock}
          onClickCall={(event) => handleOptionSelect(event, "Call")}
          onClickPut={(event) => handleOptionSelect(event, "Put")}
        />
      </div>
      <div className="BottomDiv">
        <div className="LeftDiv">
          <Portfolio data={portfolioMock} />
          <Indicators />
        </div>
        <OrderEntry
          selectedOption={selectedOption}
          selectedOptionAction={selectedOptionAction}
        />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #00022c 0%, #000003 100%)",
            color: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            border: "1px white solid",
          },
        }}
      >
        <DialogTitle>Simulation Builder</DialogTitle>
        <DialogContent>
          <SimulationBuilder onSimulationStart={handleSimulationStart} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Simulator;
