import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@v1/controllers/app.controller';
import { AppService } from '@v1/services/app.service';
import { ethers } from 'ethers';
import { BadRequestException } from '@nestjs/common';

jest.mock('ethers');

describe('AppController', () => {
  let controller: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const appServiceMock = {
      getGasPrice: jest.fn(),
      getReturnAmount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: appServiceMock }],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('getGasPrice', () => {
    it('should return gas price', async () => {
      const mockGasPrice = '1000000000';
      jest.spyOn(appService, 'getGasPrice').mockResolvedValue(mockGasPrice);

      const result = await controller.getGasPrice();
      expect(result).toEqual({ gasPrice: mockGasPrice });
    });
  });

  describe('getReturnAmount', () => {
    it('should return amountOut for valid inputs', async () => {
      const mockFromTokenAddress = '0x0000000000000000000000000000000000000000';
      const mockToTokenAddress = '0x0000000000000000000000000000000000000001';
      const mockAmountIn = '1';
      const mockAmountOut = '1000';

      jest.spyOn(ethers, 'isAddress').mockReturnValue(true);
      jest
        .spyOn(ethers, 'parseUnits')
        .mockReturnValue(BigInt(mockAmountIn + '0'.repeat(18)));
      jest
        .spyOn(appService, 'getReturnAmount')
        .mockResolvedValue(mockAmountOut);

      const result = await controller.getReturnAmount(
        mockFromTokenAddress,
        mockToTokenAddress,
        mockAmountIn,
      );

      expect(result).toEqual({ amountOut: mockAmountOut });
    });

    it('should throw BadRequestException for invalid fromTokenAddress', async () => {
      const mockFromTokenAddress = 'invalidAddress';
      const mockToTokenAddress = '0x0000000000000000000000000000000000000001';
      const mockAmountIn = '1';

      jest.spyOn(ethers, 'isAddress').mockReturnValue(false);

      await expect(
        controller.getReturnAmount(
          mockFromTokenAddress,
          mockToTokenAddress,
          mockAmountIn,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid toTokenAddress', async () => {
      const mockFromTokenAddress = '0x0000000000000000000000000000000000000000';
      const mockToTokenAddress = 'invalidAddress';
      const mockAmountIn = '1';

      jest.spyOn(ethers, 'isAddress').mockReturnValueOnce(true);
      jest.spyOn(ethers, 'isAddress').mockReturnValueOnce(false);

      await expect(
        controller.getReturnAmount(
          mockFromTokenAddress,
          mockToTokenAddress,
          mockAmountIn,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid amountIn', async () => {
      const mockFromTokenAddress = '0x0000000000000000000000000000000000000000';
      const mockToTokenAddress = '0x0000000000000000000000000000000000000001';
      const mockAmountIn = '-1';

      jest.spyOn(ethers, 'isAddress').mockReturnValue(true);
      jest.spyOn(ethers, 'parseUnits').mockImplementation(() => {
        throw new Error('Invalid amountIn');
      });

      await expect(
        controller.getReturnAmount(
          mockFromTokenAddress,
          mockToTokenAddress,
          mockAmountIn,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
