import { Module } from '@nestjs/common';
import { MessageModule } from '../message/message.module';
import { BusinessContextResolver } from './business-context.resolver';
import { BusinessContextService } from './business-context.service';

@Module({
  imports: [MessageModule],
  providers: [BusinessContextService, BusinessContextResolver],
  exports: [BusinessContextService],
})
export class BusinessContextModule {}
