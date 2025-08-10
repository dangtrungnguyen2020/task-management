import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    console.log(
      `### get login pageload: ${JSON.stringify(req.user)} data: ${data}`,
    );
    // If you pass a property like @User('username'), return that property
    return data ? user?.[data] : user;
  },
);
