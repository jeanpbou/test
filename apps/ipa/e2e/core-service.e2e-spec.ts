import { Model } from 'mongoose';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import setupE2E from '../src/utils/setupE2E';

describe('Core Service', () => {
  let server: any;
  let pivotModel: Model<any>;
  let app: INestApplication;

  beforeAll(async () => {
    [app, server, pivotModel] = await setupE2E();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[QUERY] "coreServices"', () => {
    it('should return the list of all Core Services', async () => {
      const expected = (
        await pivotModel.distinct('codecomposantmetier', {})
      ).map((i) => ({ label: i }));
      const {
        body: { data },
      } = await request(server).post('/graphql').send({
        query: '{ coreServices { label } }',
      });

      expect(data.coreServices).toEqual(expect.arrayContaining(expected));
    });

    it('should return the Core Service which corresponds to filter', async () => {
      const expected = (
        await pivotModel.distinct('codecomposantmetier', {
          codecomposantmetier: 'COM',
        })
      ).map((i) => ({ label: i }));
      const {
        body: { data },
      } = await request(server).post('/graphql').send({
        query: '{ coreServices(labels: "COM") { label } }',
      });

      expect(data.coreServices).toEqual(expect.arrayContaining(expected));
    });

    it('should return Core Services which corresponds to multi-filter', async () => {
      const expected = (
        await pivotModel.distinct('codecomposantmetier', {
          codecomposantmetier: { $in: ['COM', 'CONSTRUCTION'] },
        })
      ).map((i) => ({ label: i }));
      const {
        body: { data },
      } = await request(server).post('/graphql').send({
        query: '{ coreServices(labels: ["COM", "CONSTRUCTION"]) { label } }',
      });

      expect(data.coreServices).toEqual(expect.arrayContaining(expected));
    });
  });
});
