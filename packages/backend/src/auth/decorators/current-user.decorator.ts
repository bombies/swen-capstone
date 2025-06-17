import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type SessionKey = 'sub' | 'email' | 'role' | 'iat' | 'exp';

export const CurrentUser = createParamDecorator(
	(data: SessionKey | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const user = request.user;

		return data ? user?.[data] : user;
	},
);
