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

interface PortfolioData {
  dailyPnl: number;
  instrument: {
    symbol: string;
    expirationDate: string;
    strike: number;
    right: string;
  };
  position: number;
  marketValue: number;
  delta: number;
  gamma: number;
  vega: number;
  avgPrice: number;
  last: number;
}

interface DteData {
  dte: string;
  values: PortfolioData[];
}

const mockData: DteData[] = [
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

interface PortfolioState {
  expandedDte: Set<number>;
}

class Portfolio extends React.Component<{}, PortfolioState> {
  state: PortfolioState = {
    expandedDte: new Set(mockData.map((_, index) => index)), // Expand all by default
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
    const totalPnl = mockData.reduce(
      (acc, data) =>
        acc + data.values.reduce((acc2, item) => acc2 + item.dailyPnl, 0),
      0
    );

    return (
      <Paper className="box-background even-margin">
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
              {mockData.map((data, dteIndex) => (
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
