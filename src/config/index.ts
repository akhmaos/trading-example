import { Config } from './config.interface';

export * from './config.schema';
export * from './config.interface';

export default (): Config => ({
  server: {
    host: process.env.HOST,
    port: parseInt(process.env.PORT, 10),
  },
  trading: {
    uniswapV2FactoryAddress: process.env.UNISWAP_V2_FACTORY_ADDRESS,
    nodeUrl: process.env.NODE_URL,
  },
});
