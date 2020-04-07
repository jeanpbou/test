import { Args } from '@nestjs/graphql';

export default (name = 'labels') => {
  return Args({ name, nullable: true, type: () => [String] });
};
