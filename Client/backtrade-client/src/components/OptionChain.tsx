import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Tabs,
  Tab,
} from "@mui/material";
import "./SimulatorTable.css";
import "../index.css";
import { OptionChainData } from "../types";

interface DteData {
  dte: string;
  values: OptionChainData[];
}

const mockData: DteData[] = [
  {
    dte: "2024-07-30",
    values: [
      {
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
    ],
  },
  {
    dte: "2024-08-30",
    values: [
      {
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
    ],
  },
  {
    dte: "2024-09-30",
    values: [
      {
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
    ],
  },
];

class OptionChain extends React.Component<
  {
    title: string;
    values: OptionChainData[];
    onClickCall: (event: any) => any;
    onClickPut: (event: any) => any;
  },
  {
    selectedTab: number;
  }
> {
  state = {
    selectedTab: 0,
  };

  handleChange = (event: React.SyntheticEvent, newValue: number) => {
    this.setState({ selectedTab: newValue });
  };

  sytleProperty(property: any, styles: string[] | undefined): string {
    let finalProperty = property;
    if (typeof property === "number") {
      styles?.forEach((style) => {
        if (style === "numberEnding") {
          finalProperty = this.formatNumber(property);
        } else if (style === "addPlus") {
          finalProperty = this.addPlus(property);
        }
      });
    }
    return finalProperty;
  }

  formatNumber(number: number) {
    // Use the toLocaleString method to add suffixes to the number
    return number.toLocaleString("en-US", {
      // add suffixes for thousands, millions, and billions
      // the maximum number of decimal places to use
      maximumFractionDigits: 2,
      // specify the abbreviations to use for the suffixes
      notation: "compact",
      compactDisplay: "short",
    });
  }

  addPlus(number: number) {
    if (number > 0) return "+" + number.toString();
    else return number.toString();
  }

  positiveNegativeColor(number: any) {
    if (typeof number === "number") {
      if (number > 0) {
        return "green";
      } else if (number === 0) {
        return "white";
      } else {
        return "red";
      }
    }

    return "white";
  }

  formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB").split("/").reverse().join("/");
  }

  render(): React.ReactNode {
    const { selectedTab } = this.state;
    const currentData = mockData[selectedTab].values;

    return (
      <Paper className="box-background even-margin">
        <Tabs
          value={selectedTab}
          onChange={this.handleChange}
          aria-label="DTE Tabs"
          textColor="primary"
          indicatorColor="primary"
        >
          {mockData.map((data, index) => (
            <Tab
              label={this.formatDate(data.dte)}
              key={index}
              sx={{ color: selectedTab === index ? "black" : "lightgray" }}
            />
          ))}
        </Tabs>
        <TableContainer
          sx={{ background: "transparent !important" }}
          component={Paper}
        >
          <Table
            sx={{ minWidth: 650, background: "transparent !important" }}
            aria-label="simple table"
          >
            <TableHead className="table-head">
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Calls
                </TableCell>
                <TableCell className="table-head" align="center"></TableCell>
                <TableCell colSpan={7} align="center">
                  Puts
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="header-cell">Delta</TableCell>
                <TableCell className="header-cell">
                  Option Open Interest
                </TableCell>
                <TableCell className="header-cell">Volume</TableCell>
                <TableCell className="header-cell">BID Size</TableCell>
                <TableCell className="header-cell">BID</TableCell>
                <TableCell className="header-cell">Ask</TableCell>
                <TableCell className="header-cell">Ask Size</TableCell>
                <TableCell className="strike-header">Strike</TableCell>
                <TableCell className="header-cell">Delta</TableCell>
                <TableCell className="header-cell">
                  Option Open Interest
                </TableCell>
                <TableCell className="header-cell">Volume</TableCell>
                <TableCell className="header-cell">BID Size</TableCell>
                <TableCell className="header-cell">BID</TableCell>
                <TableCell className="header-cell">Ask</TableCell>
                <TableCell className="header-cell">Ask Size</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="table-body">
              {currentData.map((row: OptionChainData, index) => (
                <TableRow key={index}>
                  <TableCell
                    className="value-cell"
                    onClick={this.props.onClickCall}
                  >
                    {row.callDelta}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={this.props.onClickCall}
                  >
                    {row.callOptionOpenInterest}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={this.props.onClickCall}
                  >
                    {row.callVolume}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={this.props.onClickCall}
                  >
                    {row.callBidSize}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={this.props.onClickCall}
                  >
                    {row.callBid}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={this.props.onClickCall}
                  >
                    {row.callAsk}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={this.props.onClickCall}
                  >
                    {row.callAskSize}
                  </TableCell>
                  <TableCell className="strike-cell">{row.strike}</TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={this.props.onClickPut}
                  >
                    {row.putDelta}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={this.props.onClickPut}
                  >
                    {row.putOptionOpenInterest}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={this.props.onClickPut}
                  >
                    {row.putVolume}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={this.props.onClickPut}
                  >
                    {row.putBidSize}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={this.props.onClickPut}
                  >
                    {row.putBid}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={this.props.onClickPut}
                  >
                    {row.putAsk}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={this.props.onClickPut}
                  >
                    {row.putAskSize}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }
}

export default OptionChain;
