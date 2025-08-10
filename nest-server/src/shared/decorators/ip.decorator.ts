import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Ip = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Get the Request object from the ExecutionContext.
    const request = ctx.switchToHttp().getRequest();

    // Now you can safely access the headers and connection properties from the request.
    return (
      request.headers['x-forwarded-for'] || request.connection.remoteAddress
    );
  },
);
