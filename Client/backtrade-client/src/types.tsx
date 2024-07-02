export type TitleRow = {
  title: string;
  property: keyof OptionChainData;
  styles?: string[];
};

export type TitlePortfolio = {
  title: string;
  property: keyof PortfolioData;
  styles?: string[];
};

export type OptionChainData = {
  dte: string;
  symbol: string;
  callDelta: number;
  callOptionOpenInterest: number;
  callVolume: number;
  callBidSize: string;
  callBid: number;
  callAsk: number;
  callAskSize: string;
  strike: number;
  putDelta: number;
  putOptionOpenInterest: number;
  putVolume: number;
  putBidSize: string;
  putBid: number;
  putAsk: number;
  putAskSize: string;
};

export type PortfolioData = {
  drillDownPnL: number;
  finInstr: string;
  position: number;
  marketVal: number;
  avgPrice: number;
  last: number;
  change: number;
  netLiqPercent: number;
  pnLPercent: number;
  delta: number;
  gamma: number;
};
