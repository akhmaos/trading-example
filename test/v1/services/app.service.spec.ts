import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER, CacheModule, Cache } from '@nestjs/cache-manager';
import { AppService } from '@v1/services/app.service';
import { ethers } from 'ethers';

jest.mock('ethers');

describe('AppService', () => {
  let appService: AppService;
  let cacheManager: Cache;
  let providerMock: any;

  const configServiceMock = {
    get: jest.fn().mockReturnValue({
      nodeUrl: 'http://localhost:8545',
      uniswapV2FactoryAddress: '0xUniswapV2FactoryAddress',
    }),
  };

  beforeEach(async () => {
    providerMock = {
      getFeeData: jest
        .fn()
        .mockResolvedValue({ gasPrice: BigInt(20000000000) }),
    };
    ethers.JsonRpcProvider = jest.fn().mockReturnValue(providerMock);

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        AppService,
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('cacheGasPrice', () => {
    it('should update the cache with gas price and timestamp', async () => {
      const setSpy = jest.spyOn(cacheManager, 'set');
      await appService.cacheGasPrice();
      expect(setSpy).toHaveBeenCalledWith('CACHED_GAS_PRICE', '20000000000');
      expect(setSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Number),
      );
    });

    it('should log an error if fetching gas price fails', async () => {
      providerMock.getFeeData.mockRejectedValue(
        new Error('Failed to fetch gas price'),
      );
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await appService.cacheGasPrice();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to fetch gas price:',
        'Failed to fetch gas price',
      );
    });
  });

  describe('getReturnAmount', () => {
    it('should return correct amountOut for given reserves and amountIn', async () => {
      const factoryContractMock = {
        getPair: jest.fn().mockResolvedValue('0xPairAddress'),
      };
      const pairContractMock = {
        getReserves: jest.fn().mockResolvedValue([BigInt(1000), BigInt(1000)]),
      };
      ethers.Contract = jest
        .fn()
        .mockReturnValueOnce(factoryContractMock)
        .mockReturnValueOnce(pairContractMock);

      const amountOut = await appService.getReturnAmount(
        '0xTokenA',
        '0xTokenB',
        '100',
      );

      expect(amountOut).toBe('90');
    });

    it('should throw error if pair does not exist', async () => {
      const factoryContractMock = {
        getPair: jest.fn().mockResolvedValue(ethers.ZeroAddress),
      };
      ethers.Contract = jest.fn().mockReturnValue(factoryContractMock);

      await expect(
        appService.getReturnAmount('0xTokenA', '0xTokenB', '100'),
      ).rejects.toThrow('Pair does not exist');
    });
  });

  describe('getGasPrice', () => {
    it('should return cached gas price if cache is fresh', async () => {
      const getSpy = jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValueOnce((Date.now() - 3000).toString())
        .mockResolvedValueOnce('20000000000');
      await appService.cacheGasPrice();
      const gasPrice = await appService.getGasPrice();
      expect(gasPrice).toBe('20000000000');
      expect(getSpy).toHaveBeenCalledWith('CACHED_GAS_PRICE_TIMESTAMP');
      expect(getSpy).toHaveBeenCalledWith('CACHED_GAS_PRICE');
    });

    it('should update cache and return gas price if cache is stale', async () => {
      const getSpy = jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValueOnce((Date.now() - 10000).toString());
      const setSpy = jest.spyOn(cacheManager, 'set');
      await appService.cacheGasPrice();
      const gasPrice = await appService.getGasPrice();
      expect(gasPrice).toBe('20000000000');
      expect(getSpy).toHaveBeenCalledWith('CACHED_GAS_PRICE_TIMESTAMP');
      expect(setSpy).toHaveBeenCalledWith('CACHED_GAS_PRICE', '20000000000');
    });
  });
});
