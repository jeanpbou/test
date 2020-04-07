import { Module, CacheModule } from '@nestjs/common';
import { StructurePackageModule } from '../structure-package/structure-package.module';
import { PivotModule } from './../pivot/pivot.module';
import { CoreServiceResolver } from './core-service.resolver';
import { CSService } from './core-service.service';

@Module({
  imports: [
    StructurePackageModule,
    PivotModule,
    CacheModule.register({ ttl: 0 }),
  ],
  providers: [CoreServiceResolver, CSService],
})
export class CoreServiceModule {}
