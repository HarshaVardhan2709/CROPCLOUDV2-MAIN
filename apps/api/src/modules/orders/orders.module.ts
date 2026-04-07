import { Module } from '@nestjs/common';
import { CartModule } from '../cart/cart.module';
import { LogisticsModule } from '../logistics/logistics.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [CartModule, LogisticsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
