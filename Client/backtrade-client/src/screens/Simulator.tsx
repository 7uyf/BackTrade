import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import "./Simulator.css";
import SimulationControls from "../components/SimulationControls";
import UnderlyingIndex from "../components/UnderlyingIndex";
import OrderEntry from "../components/OrderEntry";
import SimulationBuilder from "../components/SimulationBuilder";
import OptionChain from "../components/OptionChain";
import {
  OptionChainData,
  PortfolioData,
  TitlePortfolio,
  TitleRow,
} from "../types";
import Portfolio from "../components/Portfolio";

const optionChainTitles: TitleRow[] = [
  { title: "Delta", property: "callDelta" },
  {
    title: "Option Open Interest",
    property: "callOptionOpenInterest",
    styles: ["numberEnding"],
  },
  { title: "Volume", property: "callVolume" },
  { title: "BID Size", property: "callBidSize" },
  { title: "BID", property: "callBid" },
  { title: "Ask", property: "callAsk" },
  { title: "Ask Size", property: "callAskSize" },
  { title: "Strike", property: "strike" },
  { title: "Delta", property: "putDelta" },
  {
    title: "Option Open Interest",
    property: "putOptionOpenInterest",
    styles: ["numberEnding"],
  },
  { title: "Volume", property: "putVolume" },
  { title: "BID Size", property: "putBidSize" },
  { title: "BID", property: "putBid" },
  { title: "Ask", property: "putAsk" },
  { title: "Ask Size", property: "putAskSize" },
];

const optionChainMock: OptionChainData[] = [];

const portfolioTitles: TitlePortfolio[] = [
  {
    title: "DrillDown Daily P&L",
    property: "drillDownPnL",
    styles: ["posativeNegativeColor"],
  },
  { title: "Fin Instr", property: "finInstr" },
  { title: "Position", property: "position" },
  { title: "Market Val.", property: "marketVal" },
  { title: "Avg. Price", property: "avgPrice" },
  { title: "Last", property: "last" },
  {
    title: "Change",
    property: "change",
    styles: ["addPlus", "posativeNegativeColor"],
  },
  {
    title: "% Of Net Liq",
    property: "netLiqPercent",
    styles: ["posativeNegativeColor"],
  },
  { title: "% Daily P&L", property: "pnLPercent" },
  { title: "Delta", property: "delta" },
  { title: "Gamma", property: "gamma" },
];

const portfolioMock: PortfolioData[] = [
  {
    drillDownPnL: 4,
    finInstr: "ICL",
    position: 10,
    marketVal: 400,
    avgPrice: 9.3,
    last: 4.75,
    change: 0.05,
    netLiqPercent: 0.35,
    pnLPercent: 0.05,
    delta: 0.34,
    gamma: 1.36,
  },
  {
    drillDownPnL: 0,
    finInstr: "ICL",
    position: 10,
    marketVal: 400,
    avgPrice: 9.3,
    last: 4.75,
    change: 0.05,
    netLiqPercent: 0.35,
    pnLPercent: 0.05,
    delta: 0.34,
    gamma: 1.36,
  },
  {
    drillDownPnL: -6,
    finInstr: "ICL",
    position: 10,
    marketVal: 400,
    avgPrice: 9.3,
    last: 4.75,
    change: 0.05,
    netLiqPercent: 0.35,
    pnLPercent: 0.05,
    delta: 0.34,
    gamma: 1.36,
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

  return (
    <div>
      <SimulationControls />
      <OptionChain
        title="Option Chain"
        values={optionChainMock}
        onClickCall={(event) => handleOptionSelect(event, "Call")}
        onClickPut={(event) => handleOptionSelect(event, "Put")}
      />
      <div className="horizontal-container">
        <div>
          <Portfolio />
          <UnderlyingIndex />
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
