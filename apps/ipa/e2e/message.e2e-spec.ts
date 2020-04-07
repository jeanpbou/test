import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import setupE2E from '../src/utils/setupE2E';

describe('Message', () => {
  let server: any;
  let app: INestApplication;

  beforeAll(async () => {
    [app, server] = await setupE2E();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[FIELD QUERY] "messages"', () => {
    it('should return the list of all messages for a parent business context', async () => {
      const expected = [
        {
          label: 'ATTENTAT',
          structurePackages: [
            {
              label: 'attentat_pivot_2018.01.c.xml',
              businessContexts: expect.arrayContaining([
                {
                  code: 'AT',
                  messages: expect.arrayContaining([
                    {
                      id: 'ME870101',
                    },
                    {
                      id: 'ME870401',
                    },
                    {
                      id: 'ME8F0201',
                    },
                    {
                      id: 'ME870301',
                    },
                    {
                      id: 'ME8J0201',
                    },
                    {
                      id: 'ME8I0201',
                    },
                    {
                      id: 'ME880201',
                    },
                    {
                      id: 'ME870201',
                    },
                    {
                      id: 'ME860101',
                    },
                    {
                      id: 'ME860201',
                    },
                    {
                      id: 'ME8E0101',
                    },
                  ]),
                },
              ]),
            },
            {
              label: 'version 2 (fabien e2e)',
              businessContexts: expect.arrayContaining([
                {
                  code: 'AT',
                  messages: expect.arrayContaining([
                    {
                      id: 'ME870101',
                    },
                  ]),
                },
                {
                  code: 'AT2',
                  messages: expect.arrayContaining([
                    {
                      id: 'ME870101',
                    },
                  ]),
                },
              ]),
            },
          ],
        },
      ];

      const {
        body: { data },
      } = await request(server).post('/graphql').send({
        query: `{ coreServices(labels: "ATTENTAT") {
            label
            structurePackages {
              label
              businessContexts {
                code
                messages {
                  id
                }
              }
            }
          }
        }`,
      });

      expect(data.coreServices).toEqual(expect.arrayContaining(expected));
    });

    it('should return message which corresponds to filter', async () => {
      const expected = [
        {
          label: 'IRD',
          structurePackages: [
            {
              label: 'ird_pivot_2019.10.a.xml',
              businessContexts: expect.arrayContaining([
                { code: 'IRD', messages: [] },
                { code: 'IR2', messages: [{ id: 'ME350502' }] },
              ]),
            },
          ],
        },
      ];

      const {
        body: { data },
      } = await request(server).post('/graphql').send({
        query: `{ coreServices(labels: "IRD") {
            label
            structurePackages {
              label
              businessContexts {
                code
                messages(ids: "ME350502") {
                  id
                }
              }
            }
          }
        }`,
      });

      expect(data.coreServices).toEqual(expect.arrayContaining(expected));
    });

    it('should return messages which corresponds to multi-filter', async () => {
      const expected = [
        {
          label: 'IRD',
          structurePackages: [
            {
              label: 'ird_pivot_2019.10.a.xml',
              businessContexts: expect.arrayContaining([
                { code: 'IRD', messages: [] },
                {
                  code: 'IR2',
                  messages: expect.arrayContaining([
                    { id: 'ME350502' },
                    { id: 'ME900201' },
                  ]),
                },
              ]),
            },
          ],
        },
      ];

      const {
        body: { data },
      } = await request(server).post('/graphql').send({
        query: `{ coreServices(labels: "IRD") {
            label
            structurePackages {
              label
              businessContexts {
                code
                messages(ids: ["ME350502", "ME900201"]) {
                  id
                }
              }
            }
          }
        }`,
      });

      expect(data.coreServices).toEqual(expect.arrayContaining(expected));
    });
  });

  describe('[FIELD QUERY] "search"', () => {
    it('should return an empty list of item for a message if no ids passed as filter', async () => {
      const expected = [
        {
          label: 'IRD',
          structurePackages: [
            {
              label: 'ird_pivot_2019.10.a.xml',
              businessContexts: expect.arrayContaining([
                { code: 'IRD', messages: [] },
                { code: 'IR2', messages: [{ id: 'ME350502', search: [] }] },
              ]),
            },
          ],
        },
      ];

      const {
        body: { data },
      } = await request(server).post('/graphql').send({
        query: `{ coreServices(labels: "IRD") {
            label
            structurePackages {
              label
              businessContexts {
                code
                messages(ids: "ME350502") {
                  id
                  search(ids: []){
                    searched
                    results {
                      ... on Segment {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }`,
      });

      expect(data.coreServices).toEqual(expect.arrayContaining(expected));
    });

    it('should return list of items which corresponds to filter', async () => {
      const expected = [
        {
          label: 'IRD',
          structurePackages: [
            {
              label: 'ird_pivot_2019.10.a.xml',
              businessContexts: expect.arrayContaining([
                { code: 'IRD', messages: [] },
                {
                  code: 'IR2',
                  messages: expect.arrayContaining([
                    {
                      id: 'ME350502',
                      search: [
                        {
                          searched: 'SE',
                          results: expect.arrayContaining([
                            {
                              id: 'SE0490201',
                            },
                            {
                              id: 'SE1260101',
                            },
                            {
                              id: 'SE0120102',
                            },
                            {
                              id: 'SE0010201',
                            },
                            {
                              id: 'SE0590301',
                            },
                            {
                              id: 'SE0500201',
                            },
                            {
                              id: 'SE0120102',
                            },
                            {
                              id: 'SE1270101',
                            },
                            {
                              id: 'SE1280101',
                            },
                          ]),
                        },
                      ],
                    },
                  ]),
                },
              ]),
            },
          ],
        },
      ];

      const {
        body: { data },
      } = await request(server).post('/graphql').send({
        query: `{ coreServices(labels: "IRD") {
            label
            structurePackages {
              label
              businessContexts {
                code
                messages(ids: "ME350502") {
                  id
                  search(ids: ["SE"]){
                    searched
                    results {
                      ... on Segment {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }`,
      });

      expect(data.coreServices).toEqual(expect.arrayContaining(expected));
    });

    it('should return all items which corresponds to multi-filter in separated results each times', async () => {
      const expected = [
        {
          label: 'IRD',
          structurePackages: [
            {
              label: 'ird_pivot_2019.10.a.xml',
              businessContexts: expect.arrayContaining([
                { code: 'IRD', messages: [] },
                {
                  code: 'IR2',
                  messages: [
                    {
                      id: 'ME350502',
                      search: [
                        {
                          searched: 'SE0590301',
                          results: expect.arrayContaining([
                            {
                              id: 'SE0590301',
                            },
                          ]),
                        },
                        {
                          searched: 'DE00070201',
                          results: expect.arrayContaining([
                            {
                              id: 'DE00070201',
                            },
                          ]),
                        },
                      ],
                    },
                  ],
                },
              ]),
            },
          ],
        },
      ];

      const {
        body: { data },
      } = await request(server).post('/graphql').send({
        query: `{ coreServices(labels: "IRD") {
            label
            structurePackages {
              label
              businessContexts {
                code
                messages(ids: "ME350502") {
                  id
                  search(ids: ["SE0590301", "DE00070201"]){
                    searched
                    results {
                      ... on Segment {
                        id
                      }
                      ... on DE {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }`,
      });

      expect(data.coreServices).toEqual(expect.arrayContaining(expected));
    });
  });
});
