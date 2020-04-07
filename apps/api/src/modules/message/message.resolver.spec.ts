import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
import { Message } from '@datahub/types';

describe('MessageResolver', () => {
  let resolver: MessageResolver;
  let service: MessageService;

  beforeAll(() => {
    service =
      {
        search: jest.fn(),
      } as any;
    resolver = new MessageResolver(service);
  });

  describe('search', () => {
    let parent: Message;
    let ids: string[];
    let returnedByMock;

    beforeEach(() => {
      parent = { id: 'testId' } as any;
      ids = ['test', 'test2'];
      returnedByMock = ['result1', 'result2'];
      (service.search as any).mockReturnValue(returnedByMock);
    });

    it('should search corresponding items for each ids passed in params', () => {
      const results = resolver.search(parent, ids);
      const expected = ids.map((id) => ({
        searched: id,
        results: returnedByMock,
      }));

      expect(service.search).toHaveBeenCalledTimes(2);
      expect(service.search).toHaveBeenNthCalledWith(1, parent, ids[0]);
      expect(service.search).toHaveBeenNthCalledWith(2, parent, ids[1]);
      expect(results).toEqual(expected);
    });
  });
});
