import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { AppService } from '@v1/services/app.service';
import { ethers } from 'ethers';

@Controller({
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('gasPrice')
  async getGasPrice(): Promise<{ gasPrice: string }> {
    const gasPrice = await this.appService.getGasPrice();
    return { gasPrice };
  }

  @Get('return/:fromTokenAddress/:toTokenAddress/:amountIn')
  @ApiParam({
    name: 'fromTokenAddress',
    example: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  })
  @ApiParam({
    name: 'toTokenAddress',
    example: '0xe2bdE374DA060F2aaC31a8261DB395b3CFda8f66',
  })
  @ApiParam({ name: 'amountIn', example: '10000000000' })
  async getReturnAmount(
    @Param('fromTokenAddress') fromTokenAddress: string,
    @Param('toTokenAddress') toTokenAddress: string,
    @Param('amountIn') amountIn: string,
  ): Promise<{ amountOut: string }> {
    if (!ethers.isAddress(fromTokenAddress)) {
      throw new BadRequestException('Invalid fromTokenAddress');
    }

    if (!ethers.isAddress(toTokenAddress)) {
      throw new BadRequestException('Invalid toTokenAddress');
    }

    try {
      const amountInBigInt = ethers.parseUnits(amountIn, 18);
      if (amountInBigInt <= 0n) {
        throw new BadRequestException('Invalid amountIn');
      }
    } catch (error) {
      throw new BadRequestException('Invalid amountIn');
    }

    const amountOut = await this.appService.getReturnAmount(
      fromTokenAddress,
      toTokenAddress,
      amountIn,
    );
    return { amountOut };
  }
}
