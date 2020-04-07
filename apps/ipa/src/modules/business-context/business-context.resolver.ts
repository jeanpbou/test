import { BusinessContext, Message } from '@datahub/types';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import LabelsParam from '../../utils/LabelsParam';
import { MessageService } from '../message/message.service';

@Resolver(BusinessContext)
export class BusinessContextResolver {
  constructor(private readonly messageService: MessageService) {}

  /**
   * Find all messages which match the label filter
   *
   * If no previous data in `parent`, retrieve data from cache data service
   * If labels is empty, no filter applied
   *
   * @param parent - parent object
   * @param ids - label filter
   */
  @ResolveField(() => [Message], {
    description: 'Query to filter messages of one BusinessContext',
  })
  async messages(
    @Parent() parent: BusinessContext,
    @LabelsParam('ids') ids: string[] = [],
  ) {
    return this.messageService.find(parent.messages, ids);
  }
}
