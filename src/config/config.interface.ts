export interface ServerConfig {
  host?: string;
  port: number;
}

export interface TradingConfig {
  uniswapV2FactoryAddress: string;
  nodeUrl: string;
}

export interface Config {
  trading: TradingConfig;
  server: ServerConfig;
}
