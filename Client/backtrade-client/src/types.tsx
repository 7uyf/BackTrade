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
  callBid: number;
  callAsk: number;
  callVega: number;
  callDelta: string;
  callGamma: number;
  callTheta: number;
  callIV: string;
  strike: number;
  putBid: number;
  putAsk: number;
  putVega: number;
  putDelta: string;
  putGamma: number;
  putTheta: number;
  putIV: string;
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
