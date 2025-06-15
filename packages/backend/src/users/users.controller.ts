import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './schemas/user.schema';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@Roles(UserRole.ADMIN)
	@ApiOperation({ summary: 'Create a new user' })
	@ApiResponse({
		status: 201,
		description: 'The user has been successfully created.',
		type: CreateUserDto,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get()
	@Roles(UserRole.ADMIN)
	@ApiOperation({ summary: 'Get all users' })
	@ApiResponse({
		status: 200,
		description: 'Return all users.',
		type: [CreateUserDto],
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	findAll() {
		return this.usersService.findAll();
	}

	@Get(':id')
	@Roles(UserRole.ADMIN)
	@ApiOperation({ summary: 'Get a user by id' })
	@ApiResponse({
		status: 200,
		description: 'Return the user.',
		type: CreateUserDto,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'User not found.' })
	findOne(@Param('id') id: string) {
		return this.usersService.findById(id);
	}

	@Patch(':id')
	@Roles(UserRole.ADMIN)
	@ApiOperation({ summary: 'Update a user' })
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully updated.',
		type: UpdateUserDto,
	})
	@ApiResponse({ status: 400, description: 'Bad request.' })
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'User not found.' })
	update(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	@Roles(UserRole.ADMIN)
	@ApiOperation({ summary: 'Delete a user' })
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully deleted.',
	})
	@ApiResponse({ status: 401, description: 'Unauthorized.' })
	@ApiResponse({ status: 403, description: 'Forbidden.' })
	@ApiResponse({ status: 404, description: 'User not found.' })
	remove(@Param('id') id: string) {
		return this.usersService.remove(id);
	}
}
