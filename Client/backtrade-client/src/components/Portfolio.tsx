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
  Tabs,
  Tab,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import "./SimulatorTable.css";
import "../index.css";
import "./Portfolio.css";
import { DtePortfolioData, OrderData } from "../types";
import IconText from "./IconText";

interface PortfolioProps {
  data: DtePortfolioData[];
  orders: OrderData[];
  scale?: number;
}

interface PortfolioState {
  expandedDte: Set<number>;
  activeTab: number;
  orderStatusFilter: string;
}

class Portfolio extends React.Component<PortfolioProps, PortfolioState> {
  state: PortfolioState = {
    expandedDte: new Set(this.props.data.map((_, index) => index)), // Expand all by default
    activeTab: 0,
    orderStatusFilter: "all",
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

  handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({ activeTab: newValue });
  };

  handleOrderStatusFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ orderStatusFilter: event.target.value });
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

  calculateAggregatedGreeks(value: any) {
    return (value.delta + value.gamma + value.vega).toFixed(2);
  }

  renderPortfolioTab() {
    const { expandedDte } = this.state;
    const totalPnl = this.props.data.reduce(
      (acc, data) =>
        acc + data.values.reduce((acc2, item) => acc2 + item.dailyPnl, 0),
      0
    );

    return (
      <Paper className="transparent-background">
        <Box
          className="margin-info"
          display="flex"
          justifyContent="space-between"
          padding="10px"
        >
          <Typography variant="h6" className="text">
            Margin
          </Typography>
          <Box display="flex" gap="20px">
            <Typography className="text">Net Value: $100,000</Typography>
            <Typography className="text">Excess Liquidity: $50,000</Typography>
            <Typography className="text">
              Maintenance Margin: $20,000
            </Typography>
          </Box>
        </Box>
        <TableContainer
          className="table-container"
          sx={{ background: "transparent !important", maxHeight: "25vh" }}
          component={Paper}
        >
          <Table
            stickyHeader
            sx={{ minWidth: 650, background: "transparent !important" }}
            aria-label="portfolio table"
          >
            <TableHead className="table-head portfolio-head">
              <TableRow>
                <TableCell className="header-cell">Aggregated Greeks</TableCell>
                <TableCell className="header-cell">Daily PnL</TableCell>
                <TableCell className="header-cell instrument-column">
                  Instrument
                </TableCell>
                <TableCell className="header-cell">Position</TableCell>
                <TableCell className="header-cell">Market Value</TableCell>
                <TableCell className="header-cell">Delta</TableCell>
                <TableCell className="header-cell">Gamma</TableCell>
                <TableCell className="header-cell">Vega</TableCell>
                <TableCell className="header-cell">Avg Price</TableCell>
                <TableCell className="header-cell">Last</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="table-body">
              {this.props.data.map((data, dteIndex) => {
                const sortedValues = [...data.values].sort(
                  (a, b) => a.instrument.strike - b.instrument.strike
                );

                return (
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
                              <TableBody className="portfolio-body">
                                {sortedValues.map((row, rowIndex) => (
                                  <TableRow key={rowIndex}>
                                    <TableCell className="text">
                                      {this.calculateAggregatedGreeks(row)}
                                    </TableCell>
                                    <TableCell className="text">
                                      {this.sytleProperty(row.dailyPnl, [
                                        "addPlus",
                                      ])}
                                    </TableCell>
                                    <TableCell className="text instrument-column">{`${
                                      row.instrument.symbol
                                    } ${this.formatDate(
                                      row.instrument.expirationDate
                                    )} ${row.instrument.strike} ${
                                      row.instrument.right
                                    }`}</TableCell>
                                    <TableCell className="text">
                                      {row.position}
                                    </TableCell>
                                    <TableCell className="text">
                                      {row.marketValue}
                                    </TableCell>
                                    <TableCell className="text">
                                      {row.delta}
                                    </TableCell>
                                    <TableCell className="text">
                                      {row.gamma}
                                    </TableCell>
                                    <TableCell className="text">
                                      {row.vega}
                                    </TableCell>
                                    <TableCell className="text">
                                      {row.avgPrice}
                                    </TableCell>
                                    <TableCell className="text">
                                      {row.last}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Paper className="total-pnl">
          <Typography
            fontSize={"13px"}
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

  renderOrdersTab() {
    const { orders } = this.props;
    const { orderStatusFilter } = this.state;

    const filteredOrders =
      orderStatusFilter === "all"
        ? orders
        : orders.filter((order) => order.status === orderStatusFilter);

    return (
      <Paper className="orders transparent-background">
        <Box display="flex" justifyContent="space-between" padding="10px">
          <Typography variant="h6" className="text">
            Orders
          </Typography>
          <TextField
            select
            label="Order Status"
            value={orderStatusFilter}
            onChange={this.handleOrderStatusFilterChange}
            variant="outlined"
            size="small"
            style={{ width: "150px" }}
            className="white-border-input"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="filled">Filled</MenuItem>
            <MenuItem value="canceled">Canceled</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </TextField>
        </Box>
        <TableContainer
          className="table-container"
          sx={{ background: "transparent !important" }}
          component={Paper}
        >
          <Table stickyHeader aria-label="orders table">
            <TableHead className="table-head">
              <TableRow>
                <TableCell className="header-cell">Instrument</TableCell>
                <TableCell className="header-cell">Expiration Date</TableCell>
                <TableCell className="header-cell">Strike Price</TableCell>
                <TableCell className="header-cell">Quantity</TableCell>
                <TableCell className="header-cell">Type</TableCell>
                <TableCell className="header-cell">Market/Limit</TableCell>
                <TableCell className="header-cell">Limit Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="table-body">
              {filteredOrders.map((order, orderIndex) => (
                <TableRow key={orderIndex}>
                  <TableCell className="text instrument-column">
                    {order.instrument}
                  </TableCell>
                  <TableCell className="text">
                    {this.formatDate(order.expirationDate)}
                  </TableCell>
                  <TableCell className="text">{order.strikePrice}</TableCell>
                  <TableCell className="text">{order.quantity}</TableCell>
                  <TableCell className="text">{order.type}</TableCell>
                  <TableCell className="text">{order.marketLimit}</TableCell>
                  <TableCell className="text">{order.limitPrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  render() {
    const { activeTab } = this.state;

    return (
      <Paper className="portfolio">
        <IconText text="Portfolio" iconSize="27px" textSize="25px" />
        <Tabs
          value={activeTab}
          onChange={this.handleTabChange}
          aria-label="portfolio tabs"
          className="portfolio-tabs"
        >
          <Tab
            label="Portfolio"
            className="portfolio-tab"
            sx={{ color: "lightgray" }}
          />
          <Tab
            label="Orders"
            className="portfolio-tab"
            sx={{ color: "lightgray" }}
          />
        </Tabs>
        {activeTab === 0 && this.renderPortfolioTab()}
        {activeTab === 1 && this.renderOrdersTab()}
      </Paper>
    );
  }
}

export default Portfolio;
