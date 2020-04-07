import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import setupE2E from '../src/utils/setupE2E';

describe('Business Context', () => {
  let server: any;
  let app: INestApplication;

  beforeAll(async () => {
    [app, server] = await setupE2E();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[FIELD QUERY] "businessContexts"', () => {
    it('should return the list of all business context for a parent structure package', async () => {
      const expected = [
        {
          label: 'IRD',
          structurePackages: [
            {
              label: 'ird_pivot_2019.10.a.xml',
              businessContexts: expect.arrayContaining([
                { code: 'IRD' },
                { code: 'IR2' },
              ]),
            },
          ],
        },
        {
          label: 'COM',
          structurePackages: [
            {
              label: 'com_pivot_2014.09.c.xml',
              businessContexts: [{ code: 'RBQ' }],
            },
          ],
        },
      ];

      const {
        body: { data },
      } = await request(server).post('/graphql').send({
        query: `{ coreServices(labels: ["IRD", "COM"]) {
            label
            structurePackages {
              label
              businessContexts {
                code
              }
            }
          }
        }`,
      });

      expect(data.coreServices).toEqual(expect.arrayContaining(expected));
    });

    it('should return business context which corresponds to filter', async () => {
      const expected = [
        {
          label: 'IRD',
          structurePackages: [
            {
              label: 'ird_pivot_2019.10.a.xml',
              businessContexts: [{ code: 'IRD' }],
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
              businessContexts(codes: "IRD"){
                code
              }
            }
          }
        }`,
      });

      expect(data.coreServices).toEqual(expect.arrayContaining(expected));
    });

    it('should return business contexts which corresponds to multi-filter', async () => {
      const expected = [
        {
          label: 'IRD',
          structurePackages: [
            {
              label: 'ird_pivot_2019.10.a.xml',
              businessContexts: expect.arrayContaining([
                { code: 'IRD' },
                { code: 'IR2' },
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
              businessContexts(codes: ["IR2", "IRD"]){
                code
              }
            }
          }
        }`,
      });

      expect(data.coreServices).toEqual(expect.arrayContaining(expected));
    });
  });
});
