import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import "./Simulator.css";
import SimulationControls from "../components/SimulationControls";
import Indicators from "../components/Indicators";
import OrderEntry from "../components/OrderEntry/OrderEntry";
import SimulationBuilder from "../components/SimulationBuilder";
import OptionChain, { OptionChainRef } from "../components/OptionChain";
import {
  DtePortfolioData,
  OptionChainData,
  OrderData,
  OrderEntryData,
} from "../types";
import Portfolio from "../components/Portfolio";

const optionChainMock: OptionChainData[] = [
  // AAPL options
  {
    dte: "2024-07-30",
    symbol: "AAPL",
    callBid: 1.2,
    callAsk: 1.3,
    callVega: 0.3,
    callDelta: 0.5,
    callGamma: 0.01,
    callTheta: -0.02,
    callIv: 20,
    strike: 150,
    putBid: 1.1,
    putAsk: 1.2,
    putVega: 0.25,
    putDelta: -0.5,
    putGamma: 0.02,
    putTheta: -0.03,
    putIv: 18,
  },
  {
    dte: "2024-07-30",
    symbol: "AAPL",
    callBid: 1.5,
    callAsk: 1.6,
    callVega: 0.35,
    callDelta: 0.55,
    callGamma: 0.015,
    callTheta: -0.025,
    callIv: 22,
    strike: 160,
    putBid: 1.3,
    putAsk: 1.4,
    putVega: 0.27,
    putDelta: -0.55,
    putGamma: 0.025,
    putTheta: -0.035,
    putIv: 20,
    putQuantity: 2,
  },
  {
    dte: "2024-08-30",
    symbol: "AAPL",
    callBid: 2.0,
    callAsk: 2.2,
    callVega: 0.4,
    callDelta: 0.6,
    callGamma: 0.02,
    callTheta: -0.03,
    callIv: 25,
    strike: 170,
    putBid: 1.8,
    putAsk: 2.0,
    putVega: 0.3,
    putDelta: -0.6,
    putGamma: 0.03,
    putTheta: -0.04,
    putIv: 22,
  },
  {
    dte: "2024-08-30",
    symbol: "AAPL",
    callBid: 2.5,
    callAsk: 2.7,
    callVega: 0.45,
    callDelta: 0.65,
    callGamma: 0.025,
    callTheta: -0.035,
    callIv: 28,
    callQuantity: 3,
    strike: 180,
    putBid: 2.3,
    putAsk: 2.5,
    putVega: 0.35,
    putDelta: -0.65,
    putGamma: 0.035,
    putTheta: -0.045,
    putIv: 25,
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

const ordersMock: OrderData[] = [
  {
    instrument: "AAPL",
    expirationDate: "2024-07-30",
    strikePrice: 150,
    quantity: 10,
    type: "Call",
    marketLimit: "Limit",
    limitPrice: 1.25,
    status: "filled",
  },
  {
    instrument: "GOOGL",
    expirationDate: "2024-08-30",
    strikePrice: 2500,
    quantity: 5,
    type: "Put",
    marketLimit: "Market",
    limitPrice: 1.5,
    status: "pending",
  },
  // Add more orders if needed...
];

const Simulator: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<OrderEntryData[]>([]);
  const [resetHighlightedRows, setResetHighlightedRows] = useState(0);
  const optionChainRef = useRef<OptionChainRef>(null);

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
    setOpen(false);
  };

  const handleOptionSelect = (
    option: OptionChainData | null,
    type: "Call" | "Put" | null
  ) => {
    if (option && type) {
      const existingIndex = selectedOptions.findIndex(
        (o) =>
          o.dte === option.dte && o.strike === option.strike && o.type === type
      );
      if (existingIndex !== -1) {
        const updatedOptions = [...selectedOptions];
        updatedOptions.splice(existingIndex, 1);
        setSelectedOptions(updatedOptions);
      } else {
        const newOrder: OrderEntryData = {
          quantity: 1,
          action: "Buy",
          dte: option.dte,
          strike: option.strike,
          type,
          vega: type === "Call" ? option.callVega : option.putVega,
          delta: type === "Call" ? option.callDelta : option.putDelta,
          gamma: type === "Call" ? option.callGamma : option.putGamma,
          theta: type === "Call" ? option.callTheta : option.putTheta,
          symbol: option.symbol,
        };
        setSelectedOptions([...selectedOptions, newOrder]);
      }
    }
  };

  const handlePlaceOrder = (
    orders: OrderEntryData[],
    orderType: string,
    limitPrice: number
  ) => {
    console.log("Placing order with options:", orders, orderType, limitPrice);
    setResetHighlightedRows((prev) => prev + 1);
  };

  const handleSpeedChange = (speed: number) => {
    console.log("handleSpeedChange", speed);
  };

  const handleTimeChange = (timeIndex: number) => {
    console.log("handleTimeChange", timeIndex);
  };

  const handleFinish = () => {
    console.log("handleFinish");
  };

  const handleRestart = () => {
    console.log("handleRestart");
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
          ref={optionChainRef}
          title="Option Chain"
          scale={1}
          values={optionChainMock}
          onOptionSelect={handleOptionSelect}
          resetHighlightedRows={resetHighlightedRows}
          selectedOptions={selectedOptions}
          onOptionsChange={setSelectedOptions}
        />
      </div>
      <div className="BottomDiv">
        <div className="LeftDiv">
          <Portfolio data={portfolioMock} orders={ordersMock} />
          <Indicators />
        </div>
        <OrderEntry
          selectedOptions={selectedOptions}
          onOptionsChange={setSelectedOptions}
          onPlaceOrder={handlePlaceOrder}
          optionChainRef={optionChainRef}
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
