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
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import "./SimulatorTable.css";
import "./OptionChain.css";
import { OptionChainData } from "../types";
import IconText from "./IconText";

interface OptionChainProps {
  title: string;
  values: OptionChainData[];
  onClickCall: (option: OptionChainData) => void;
  onClickPut: (option: OptionChainData) => void;
}

interface OptionChainState {
  selectedTab: number;
  selectedSymbol: string;
  symbols: string[];
}

class OptionChain extends React.Component<OptionChainProps, OptionChainState> {
  state: OptionChainState = {
    selectedTab: 0,
    selectedSymbol: "QQQ",
    symbols: ["QQQ", "SPY"], // Add your symbols here
  };

  handleChange = (event: React.SyntheticEvent, newValue: number) => {
    this.setState({ selectedTab: newValue });
  };

  handleSymbolChange = (event: SelectChangeEvent<string>) => {
    this.setState({ selectedSymbol: event.target.value as string });
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
    return number.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      notation: "compact",
      compactDisplay: "short",
    });
  }

  addPlus(number: number) {
    return number > 0 ? "+" + number.toString() : number.toString();
  }

  positiveNegativeColor(number: any) {
    if (typeof number === "number") {
      if (number > 0) return "green";
      else if (number === 0) return "white";
      else return "red";
    }
    return "white";
  }

  formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB").split("/").reverse().join("/");
  }

  render(): React.ReactNode {
    const { selectedTab, selectedSymbol, symbols } = this.state;
    const { onClickCall, onClickPut } = this.props;
    const filteredData = this.props.values.filter(
      (option) => option.symbol === selectedSymbol
    );
    const currentDtes = Array.from(
      new Set(filteredData.map((data) => data.dte))
    );
    const currentData = filteredData.filter(
      (option) => option.dte === currentDtes[selectedTab]
    );

    return (
      <Paper className="option-chain">
        <IconText text="Option Chain"/>
        <Box
          className="uprow"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Tabs
            value={selectedTab}
            onChange={this.handleChange}
            aria-label="DTE Tabs"
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{
              style: {
                display: "flex",
                justifyContent: "center",
                backgroundColor: "transparent",
              },
            }}
            sx={{
              "& .MuiTabs-indicator": {
                display: "flex",
                justifyContent: "center",
                backgroundColor: "transparent",
              },
              "& .MuiTabs-indicatorSpan": {
                maxWidth: 40, // Adjust this value to fit the text
                width: "100%",
                backgroundColor: "primary",
              },
            }}
          >
            {currentDtes.map((dte, index) => (
              <Tab
                label={this.formatDate(dte)}
                key={index}
                sx={{ color: selectedTab === index ? "black" : "lightgray" }}
              />
            ))}
          </Tabs>
          <FormControl sx={{ minWidth: 80, marginRight: 2 }}>
            <InputLabel className="inputlabel">Symbol</InputLabel>
            <Select
              className="symbol-select"
              value={selectedSymbol}
              onChange={this.handleSymbolChange}
              label="Symbol"
            >
              {symbols.map((symbol) => (
                <MenuItem key={symbol} value={symbol}>
                  {symbol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TableContainer
          sx={{ background: "transparent !important" }}
          component={Paper}
          className="table-container"
        >
          <Table
            sx={{ minWidth: 50, background: "transparent !important" }}
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
                <TableCell className="header-cell">Bid</TableCell>
                <TableCell className="header-cell">Ask</TableCell>
                <TableCell className="header-cell">Vega</TableCell>
                <TableCell className="header-cell">Delta</TableCell>
                <TableCell className="header-cell">Gamma</TableCell>
                <TableCell className="header-cell">Theta</TableCell>
                <TableCell className="header-cell">IV</TableCell>
                <TableCell className="strike-header">Strike</TableCell>
                <TableCell className="header-cell">Bid</TableCell>
                <TableCell className="header-cell">Ask</TableCell>
                <TableCell className="header-cell">Vega</TableCell>
                <TableCell className="header-cell">Delta</TableCell>
                <TableCell className="header-cell">Gamma</TableCell>
                <TableCell className="header-cell">Theta</TableCell>
                <TableCell className="header-cell">IV</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="table-body">
              {currentData.map((row: OptionChainData, index) => (
                <TableRow key={index}>
                  <TableCell
                    className="value-cell"
                    onClick={() => onClickCall(row)}
                  >
                    {row.callBid}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={() => onClickCall(row)}
                  >
                    {row.callAsk}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={() => onClickCall(row)}
                  >
                    {row.callVega}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={() => onClickCall(row)}
                  >
                    {row.callDelta}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={() => onClickCall(row)}
                  >
                    {row.callGamma}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={() => onClickCall(row)}
                  >
                    {row.callTheta}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={() => onClickCall(row)}
                  >
                    {row.callIV}
                  </TableCell>
                  <TableCell className="strike-cell">{row.strike}</TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={() => onClickPut(row)}
                  >
                    {row.putBid}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={() => onClickPut(row)}
                  >
                    {row.putAsk}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={() => onClickPut(row)}
                  >
                    {row.putVega}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={() => onClickPut(row)}
                  >
                    {row.putDelta}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={() => onClickPut(row)}
                  >
                    {row.putGamma}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={() => onClickPut(row)}
                  >
                    {row.putTheta}
                  </TableCell>
                  <TableCell
                    className="value-cell"
                    onClick={() => onClickPut(row)}
                  >
                    {row.putIV}
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
