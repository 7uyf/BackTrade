import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Collapse,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import "./SimulatorTable.css";
import "../index.css";
import "./Portfolio.css";
import { DtePortfolioData } from "../types";
import IconText from "./IconText";

interface PortfolioProps {
  data: DtePortfolioData[];
  scale?: number;
}

interface PortfolioState {
  expandedDte: Set<number>;
}

class Portfolio extends React.Component<PortfolioProps, PortfolioState> {
  state: PortfolioState = {
    expandedDte: new Set(this.props.data.map((_, index) => index)), // Expand all by default
  };

  handleExpandClick = (index: number) => {
    this.setState((prevState) => {
      const expandedDte = new Set(prevState.expandedDte);
      if (expandedDte.has(index)) {
        expandedDte.delete(index);
      } else {
        expandedDte.add(index);
      }
      return { expandedDte };
    });
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

  render() {
    const { expandedDte } = this.state;
    const { scale = 1 } = this.props;
    const totalPnl = this.props.data.reduce(
      (acc, data) =>
        acc + data.values.reduce((acc2, item) => acc2 + item.dailyPnl, 0),
      0
    );

    return (
      <Paper className="portfolio" style={{ transform: `scale(${scale})` }}>
        <IconText text="Portfolio" iconSize="27px" textSize="25px" />
        <TableContainer
          className="table-container"
          sx={{ background: "transparent !important", maxHeight: "25vh" }} // Max height for scroll
          component={Paper}
        >
          <Table
            stickyHeader
            sx={{ minWidth: 650, background: "transparent !important" }}
            aria-label="simple table"
          >
            <TableHead className="table-head">
              <TableRow>
                <TableCell>Daily PnL</TableCell>
                <TableCell>Instrument</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Market Value</TableCell>
                <TableCell>Delta</TableCell>
                <TableCell>Gamma</TableCell>
                <TableCell>Vega</TableCell>
                <TableCell>Avg Price</TableCell>
                <TableCell>Last</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="table-body">
              {this.props.data.map((data, dteIndex) => (
                <React.Fragment key={dteIndex}>
                  <TableRow className="dte-row">
                    <TableCell colSpan={10}>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          size="small"
                          onClick={() => this.handleExpandClick(dteIndex)}
                          style={{ color: "white" }}
                        >
                          {expandedDte.has(dteIndex) ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                        <Typography
                          variant="subtitle1"
                          style={{ color: "white" }}
                        >
                          {this.formatDate(data.dte)}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={10} style={{ padding: 0 }}>
                      <Collapse
                        in={expandedDte.has(dteIndex)}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={1}>
                          <Table size="small" aria-label="purchases">
                            <TableBody>
                              {data.values.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                  <TableCell>
                                    {this.sytleProperty(row.dailyPnl, [
                                      "addPlus",
                                    ])}
                                  </TableCell>
                                  <TableCell>{`${
                                    row.instrument.symbol
                                  } ${this.formatDate(
                                    row.instrument.expirationDate
                                  )} ${row.instrument.strike} ${
                                    row.instrument.right
                                  }`}</TableCell>
                                  <TableCell>{row.position}</TableCell>
                                  <TableCell>{row.marketValue}</TableCell>
                                  <TableCell>{row.delta}</TableCell>
                                  <TableCell>{row.gamma}</TableCell>
                                  <TableCell>{row.vega}</TableCell>
                                  <TableCell>{row.avgPrice}</TableCell>
                                  <TableCell>{row.last}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Paper className="total-pnl">
          <Typography
            fontWeight={"bold"}
            align="right"
            style={{ padding: "10px" }}
          >
            Total PnL: {this.sytleProperty(totalPnl, ["addPlus"])}
          </Typography>
        </Paper>
      </Paper>
    );
  }
}

export default Portfolio;
