import { MessageService } from './message.service';
import { Message } from '@datahub/types';

describe('MessageService', () => {
  let messageService: MessageService;

  beforeAll(() => {
    messageService = new MessageService();
  });

  describe('find', () => {
    let data: Message[];
    let ids: string[];

    beforeEach(() => {
      data = [{ id: 'returned' }, { id: 'never' }] as Message[];
      ids = ['returned'];
    });

    it('should filter messages with ids passed', () => {
      const expected = [{ id: 'returned' }];
      expect(messageService.find(data, ids)).toEqual(expected);
    });

    it('should return all messages if no ids passed', () => {
      ids = [];
      const expected = [...data];
      expect(messageService.find(data, ids)).toEqual(expected);
    });
  });

  describe('search', () => {
    let message: Message;
    let id: string;

    beforeEach(() => {
      message =
        {
          id: 'ME0115',
          groups: [{ id: 'GR0113', segments: [{ id: 'SE0116' }] }],
          segments: [{ id: 'SE0117' }],
        } as any;
      id = 'SE01';
    });

    it('should return all items in message with corresponding id when type is present in id', () => {
      const expected = [{ id: 'SE0117' }, { id: 'SE0116' }];
      expect(messageService.search(message, id)).toEqual(
        expect.arrayContaining(expected),
      );
    });

    it('should return all items in message with corresponding id when type is not present in id (whatever type)', () => {
      id = '01';
      const expected = [
        { id: 'SE0117' },
        { id: 'SE0116' },
        { id: 'GR0113', segments: [{ id: 'SE0116' }] },
        {
          id: 'ME0115',
          groups: [{ id: 'GR0113', segments: [{ id: 'SE0116' }] }],
          segments: [{ id: 'SE0117' }],
        },
      ];

      expect(messageService.search(message, id)).toEqual(
        expect.arrayContaining(expected),
      );
    });
  });
});
