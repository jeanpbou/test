import { PivotModel, SearchResultResolver } from '@datahub/types';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Document, Model } from 'mongoose';
import { CoreServiceModule } from '../modules/core-service/core-service.module';
import { DateScalar } from '@datahub/scalars';

interface Pivot extends PivotModel, Document {}

/**
 * This methods returns :
 * - an instance of app connected to a test instance of mongodb
 * - the http server of this app
 * - the "pivots" collection of mongoose instance
 */
export default async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      GraphQLModule.forRoot({
        playground: false, // Playground is not required in e2e context
        typePaths: ['./**/*.gql'], // To load graphql type from schema.gql file
      }),
      MongooseModule.forRoot('mongodb://localhost:27323/datahub', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      CoreServiceModule,
    ],
    providers: [DateScalar, SearchResultResolver],
  }).compile();

  const app = module.createNestApplication();
  await app.init();

  const pivotModel: Model<Pivot> = app.get('PivotModel');
  const server = app.getHttpServer();

  return [app, server, pivotModel];
};
