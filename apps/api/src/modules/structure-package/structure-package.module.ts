import { Module } from '@nestjs/common';
import { BusinessContextModule } from '../business-context/business-context.module';
import { PivotModule } from './../pivot/pivot.module';
import { StructurePackageResolver } from './structure-package.resolver';
import { StructurePackageService } from './structure-package.service';

@Module({
  imports: [BusinessContextModule, PivotModule],
  providers: [StructurePackageResolver, StructurePackageService],
  exports: [StructurePackageService],
})
export class StructurePackageModule {}
