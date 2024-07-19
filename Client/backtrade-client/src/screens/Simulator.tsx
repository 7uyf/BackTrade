import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import "./Simulator.css";
import SimulationControls from "../components/SimulationControls";
import Indicators from "../components/Indicators";
import OrderEntry from "../components/OrderEntry";
import SimulationBuilder from "../components/SimulationBuilder";
import OptionChain from "../components/OptionChain";
import { DtePortfolioData, OptionChainData, PortfolioData } from "../types";
import Portfolio from "../components/Portfolio";

const optionChainMock: OptionChainData[] = [
  {
    dte: "2024-07-30",
    symbol: "AAPL",
    callDelta: 0.5,
    callOptionOpenInterest: 100,
    callVolume: 150,
    callBidSize: "10",
    callBid: 1.2,
    callAsk: 1.3,
    callAskSize: "15",
    strike: 150,
    putDelta: -0.5,
    putOptionOpenInterest: 200,
    putVolume: 100,
    putBidSize: "12",
    putBid: 1.1,
    putAsk: 1.2,
    putAskSize: "14",
  },
  {
    dte: "2024-07-30",
    symbol: "AAPL",
    callDelta: 0.6,
    callOptionOpenInterest: 120,
    callVolume: 160,
    callBidSize: "11",
    callBid: 1.3,
    callAsk: 1.4,
    callAskSize: "16",
    strike: 155,
    putDelta: -0.6,
    putOptionOpenInterest: 220,
    putVolume: 110,
    putBidSize: "13",
    putBid: 1.2,
    putAsk: 1.3,
    putAskSize: "15",
  },
  {
    dte: "2024-07-30",
    symbol: "AAPL",
    callDelta: 0.7,
    callOptionOpenInterest: 130,
    callVolume: 170,
    callBidSize: "12",
    callBid: 1.4,
    callAsk: 1.5,
    callAskSize: "17",
    strike: 160,
    putDelta: -0.7,
    putOptionOpenInterest: 230,
    putVolume: 120,
    putBidSize: "14",
    putBid: 1.3,
    putAsk: 1.4,
    putAskSize: "16",
  },
  {
    dte: "2024-08-30",
    symbol: "AAPL",
    callDelta: 0.4,
    callOptionOpenInterest: 140,
    callVolume: 180,
    callBidSize: "13",
    callBid: 1.5,
    callAsk: 1.6,
    callAskSize: "18",
    strike: 165,
    putDelta: -0.4,
    putOptionOpenInterest: 240,
    putVolume: 130,
    putBidSize: "15",
    putBid: 1.4,
    putAsk: 1.5,
    putAskSize: "17",
  },
  {
    dte: "2024-08-30",
    symbol: "AAPL",
    callDelta: 0.3,
    callOptionOpenInterest: 150,
    callVolume: 190,
    callBidSize: "14",
    callBid: 1.6,
    callAsk: 1.7,
    callAskSize: "19",
    strike: 170,
    putDelta: -0.3,
    putOptionOpenInterest: 250,
    putVolume: 140,
    putBidSize: "16",
    putBid: 1.5,
    putAsk: 1.6,
    putAskSize: "18",
  },
  {
    dte: "2024-08-30",
    symbol: "AAPL",
    callDelta: 0.2,
    callOptionOpenInterest: 160,
    callVolume: 200,
    callBidSize: "15",
    callBid: 1.7,
    callAsk: 1.8,
    callAskSize: "20",
    strike: 175,
    putDelta: -0.2,
    putOptionOpenInterest: 260,
    putVolume: 150,
    putBidSize: "17",
    putBid: 1.6,
    putAsk: 1.7,
    putAskSize: "19",
  },
  {
    dte: "2024-09-30",
    symbol: "AAPL",
    callDelta: 0.1,
    callOptionOpenInterest: 170,
    callVolume: 210,
    callBidSize: "16",
    callBid: 1.8,
    callAsk: 1.9,
    callAskSize: "21",
    strike: 180,
    putDelta: -0.1,
    putOptionOpenInterest: 270,
    putVolume: 160,
    putBidSize: "18",
    putBid: 1.7,
    putAsk: 1.8,
    putAskSize: "20",
  },
  {
    dte: "2024-09-30",
    symbol: "AAPL",
    callDelta: 0.0,
    callOptionOpenInterest: 180,
    callVolume: 220,
    callBidSize: "17",
    callBid: 1.9,
    callAsk: 2.0,
    callAskSize: "22",
    strike: 185,
    putDelta: 0.0,
    putOptionOpenInterest: 280,
    putVolume: 170,
    putBidSize: "19",
    putBid: 1.8,
    putAsk: 1.9,
    putAskSize: "21",
  },
  {
    dte: "2024-09-30",
    symbol: "AAPL",
    callDelta: -0.1,
    callOptionOpenInterest: 190,
    callVolume: 230,
    callBidSize: "18",
    callBid: 2.0,
    callAsk: 2.1,
    callAskSize: "23",
    strike: 190,
    putDelta: 0.1,
    putOptionOpenInterest: 290,
    putVolume: 180,
    putBidSize: "20",
    putBid: 1.9,
    putAsk: 2.0,
    putAskSize: "22",
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
    <div className="mainDiv">
      <SimulationControls
        scale={0.7}
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
        scale={0.6}
      />
      <Portfolio data={portfolioMock} scale={0.5} />
      <Indicators scale={0.5} />
      <OrderEntry
        selectedOption={selectedOption}
        selectedOptionAction={selectedOptionAction}
        scale={0.6}
      />
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
