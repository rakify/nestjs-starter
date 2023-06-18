import { Query, Resolver } from '@nestjs/graphql';
import { CheckConnectionDTO } from './user/dto/check-connection.input';

@Resolver()
export class AppResolver {
  // to check the connection
  @Query(() => CheckConnectionDTO)
  checkServer(): CheckConnectionDTO {
    return { connectionStatus: 'Server is up and running!' };
  }
}
