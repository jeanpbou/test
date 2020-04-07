import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import setupE2E from '../src/utils/setupE2E';

jest.setTimeout(10000);

describe('Structure Package', () => {
  let server: any;
  let app: INestApplication;

  beforeAll(async () => {
    [app, server] = await setupE2E();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[FIELD QUERY] "structurePackages"', () => {
    it('should return the list of all structure packages for a parent core service', async () => {
      const expected = [
        {
          label: 'COM',
          structurePackages: [{ label: 'com_pivot_2014.09.c.xml' }],
        },
        {
          label: 'CONSTRUCTION',
          structurePackages: [{ label: 'construction_pivot_2017.10.a.xml' }],
        },
        {
          label: 'ATTENTAT',
          structurePackages: [
            { label: 'attentat_pivot_2018.01.c.xml' },
            { label: 'version 2 (fabien e2e)' },
          ],
        },
        {
          label: 'IRD',
          structurePackages: [{ label: 'ird_pivot_2019.10.a.xml' }],
        },
      ];

      const {
        body: { data },
      } = await request(server).post('/graphql').send({
        query: '{ coreServices { label structurePackages { label } } }',
      });

      expect(data.coreServices).toEqual(expect.arrayContaining(expected));
    });

    it('should return structure package which corresponds to filter', async () => {
      const expected = [
        {
          label: 'COM',
          structurePackages: [{ label: 'com_pivot_2014.09.c.xml' }],
        },
      ];

      const {
        body: { data },
      } = await request(server).post('/graphql').send({
        query:
          '{ coreServices { label structurePackages(labels: "com_pivot_2014.09.c.xml") { label } } }',
      });

      expect(data.coreServices).toEqual(expect.arrayContaining(expected));
    });

    it('should return structure packages which corresponds to multi-filter', async () => {
      const expected = [
        {
          label: 'COM',
          structurePackages: [{ label: 'com_pivot_2014.09.c.xml' }],
        },
        {
          label: 'ATTENTAT',
          structurePackages: [{ label: 'attentat_pivot_2018.01.c.xml' }],
        },
      ];

      const {
        body: { data },
      } = await request(server).post('/graphql').send({
        query: `{ coreServices {
            label
            structurePackages(labels: ["com_pivot_2014.09.c.xml", "attentat_pivot_2018.01.c.xml"])
            {
              label
            }
          }
        }`,
      });

      expect(data.coreServices).toEqual(expect.arrayContaining(expected));
    });
  });
});
