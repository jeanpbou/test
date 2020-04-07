import { Message, SearchResultById } from '@datahub/types';
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { MessageService } from './message.service';

@Resolver(Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  /**
   * Find all items which contains one of ids
   *
   * @param parent - parent object
   * @param ids - id filter
   */
  @ResolveField(() => [SearchResultById], {
    description: 'Search query for items in message',
  })
  search(
    @Parent() parent: Message,
    @Args({ name: 'ids', type: () => [String] }) ids: string[],
  ) {
    return ids.map((id) => ({
      searched: id,
      results: this.messageService.search(parent, id),
    }));
  }
}
