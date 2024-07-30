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
  callDelta: number;
  callGamma: number;
  callTheta: number;
  callIv: number;
  callQuantity?: number;
  strike: number;
  putBid: number;
  putAsk: number;
  putVega: number;
  putDelta: number;
  putGamma: number;
  putTheta: number;
  putIv: number;
  putQuantity?: number;
};

export type OrderEntryData = {
  dte: string;
  symbol: string;
  action: "Buy" | "Sell";
  quantity: number;
  strike: number;
  type: "Call" | "Put";
  vega: number;
  delta: number;
  gamma: number;
  theta: number;
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

export type OrderData = {
  instrument: string;
  expirationDate: string;
  strikePrice: number;
  quantity: number;
  type: "Call" | "Put";
  marketLimit: "Market" | "Limit";
  limitPrice: number;
  status: "filled" | "canceled" | "pending";
};
