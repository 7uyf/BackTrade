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
  stock_symbol: string;
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
};

export type DtePortfolioData = {
  dte: string;
  values: PortfolioData[];
};
