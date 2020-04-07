import { DateScalar } from '@datahub/scalars';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { environment } from './environments/environment';
import { CoreServiceModule } from './modules/core-service/core-service.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      fieldResolverEnhancers: ['interceptors'],
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),
    MongooseModule.forRoot(environment.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    CoreServiceModule,
  ],
  providers: [DateScalar],
})
export class AppModule {}
