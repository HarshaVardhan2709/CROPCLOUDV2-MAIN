import { Body, Controller, Post } from '@nestjs/common';
import { DeliverabilityDto } from './dto';
import { LogisticsService } from './logistics.service';

@Controller({ path: 'logistics', version: '1' })
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Post('deliverability')
  deliverability(@Body() dto: DeliverabilityDto) {
    return this.logisticsService.checkDeliverabilityForProduct(dto.productId, dto);
  }
}
