import { BusinessContext, Message } from '@datahub/types';
import { MessageService } from './../message/message.service';
import { BusinessContextResolver } from './business-context.resolver';

describe('BusinessContextResolver', () => {
  let resolver: BusinessContextResolver;
  let service: MessageService;

  beforeAll(() => {
    service =
      {
        find: jest.fn(),
      } as any;
    resolver = new BusinessContextResolver(service);
  });

  describe('messages', () => {
    let expected: Message[];
    let ids: string[];
    let parent: BusinessContext;

    beforeEach(() => {
      ids = ['test', 'test2'];
      parent =
        {
          code: 'test',
          from: 'test',
          messages: [{ msg: 'test' }],
        } as any;
      expected = [{ results: 'expected' }] as any;
      (service.find as any).mockReturnValue(expected);
    });

    afterEach(() => {
      (service.find as any).mockReset();
    });

    it('should use an empty array as default value for ids filter', async () => {
      await resolver.messages(parent);

      expect(service.find).toHaveBeenCalledWith(parent.messages, []);
    });

    it('should filter messages list with ids filter passed in params', async () => {
      const results = await resolver.messages(parent, ids);

      expect(service.find).toHaveBeenCalledWith(parent.messages, ids);
      expect(results).toBe(expected);
    });
  });
});
