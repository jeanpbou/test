import { StructurePackageIPA, CoreServiceIPA } from '@datahub/types';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import LabelsParam from '../../utils/LabelsParam';
import { StructurePackageService } from './../structure-package/structure-package.service';
import { CSService } from './core-service.service';

@Resolver(CoreServiceIPA)
export class CoreServiceResolver {
  constructor(
    private readonly csService: CSService,
    private readonly structurePackageService: StructurePackageService,
    @Inject(CACHE_MANAGER) private readonly cacheManager,
  ) {}

  /**
   * Find all coreServices which match the label filter
   *
   * If labels is empty, no filter applied
   *
   * @param labels - label filter
   */
  @Query(() => [CoreServiceIPA], {
    description: 'Query to filter CoreService',
  })
  async coreServices(@LabelsParam() labels: string[] = []) {
    const data = await this.retrieveData('coreServices', () =>
      this.csService.getCoreServices(),
    );

    return this.csService.filter(data, labels);
  }

  /**
   * Find all structurePackages which match the label filter
   *
   * If no previous data in `parent`, retrieve data from cache data service
   * If labels is empty, no filter applied
   *
   * @param labels - label filter
   * @param parent - parent object
   */
  @ResolveField(() => [StructurePackageIPA], {
    description: 'Query to filter StructurePackage of one CoreService',
  })
  async structurePackages(
    @Parent() parent: CoreServiceIPA,
    @LabelsParam() labels: string[] = [],
  ) {
    const names = labels.length
      ? parent.structurePackages.filter((sp) => labels.includes(sp))
      : parent.structurePackages;

    const structurePackages = await Promise.all(
      names.map((name) =>
        this.retrieveData(name, () =>
          this.structurePackageService.getStructurePackage(name),
        ),
      ),
    );

    return structurePackages;
  }

  /**
   * Retrieve data from cache by key
   *
   * If data not already present in cache, load it with callback passed in params
   *
   * @param key - key to load
   * @param onNoData - callback to retrieve data
   */
  private async retrieveData(key: string, onNoData: Function) {
    let data = await this.cacheManager.get(key);
    if (!data) {
      data = await onNoData.bind(this)();
      await this.cacheManager.set(key, data);
    }
    return data;
  }
}
