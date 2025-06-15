import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Token, TokenSchema } from './schemas/token.schema';
import { SessionService } from './session.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenService } from './token.service';

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET || 'your-secret-key',
			signOptions: { expiresIn: '1d' },
		}),
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Token.name, schema: TokenSchema },
		]),
	],
	controllers: [AuthController],
	providers: [UsersService, AuthService, JwtStrategy, SessionService, TokenService],
	exports: [AuthService, SessionService, TokenService],
})
export class AuthModule {}
