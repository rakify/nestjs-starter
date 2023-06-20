import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserEntity } from 'modules/user/user.entity';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';

// this guard checks if requested user is authenticated
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);

    const token = ctx.getContext().token as string;

    const result = await this.jwtService.verifyAsync(token);
    if (!result) return false;

    const user: UserEntity | undefined | null =
      await this.authService.findByEmail(result['email']);
    // Checking if the user exists and isActive
    if (user && !user.isActive) return false;

    const gqlContext = GqlExecutionContext.create(context);
    gqlContext.getContext().user = user; // Set the user in the execution context so CurrentUser gets this user

    return true;
  }
}