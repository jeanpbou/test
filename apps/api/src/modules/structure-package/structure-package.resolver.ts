import { BusinessContext, StructurePackageIPA } from '@datahub/types';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import LabelsParam from '../../utils/LabelsParam';
import { BusinessContextService } from '../business-context/business-context.service';

@Resolver(StructurePackageIPA)
export class StructurePackageResolver {
  constructor(
    private readonly businessContextService: BusinessContextService,
  ) {}

  /**
   * Find all businessContexts which match the label filter
   *
   * If no previous data in `parent`, retrieve data from cache data service
   * If labels is empty, no filter applied
   *
   * @param parent - parent object
   * @param codes - label filter
   */
  @ResolveField(() => [BusinessContext], {
    description: 'Query to filter BusinessContext of one StructurePackage',
  })
  async businessContexts(
    @Parent() parent: StructurePackageIPA,
    @LabelsParam('codes') codes: string[] = [],
  ) {
    return this.businessContextService.find(parent.businessContexts, codes);
  }
}
