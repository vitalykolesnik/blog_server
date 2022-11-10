import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { UserService } from '@app/user/user.service';
import { CreateUserDto } from '@app/user/dto/createUserDto.dto';
import { UserResponseInterface } from '@app/user/types/userResponse.interface';
import { RequestCreateUserDto } from '@app/user/dto/requestCreateUserDto';

@ApiTags('users')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({
    type: RequestCreateUserDto,
  })
  @ApiCreatedResponse()
  @ApiBadRequestResponse()
  @ApiUnprocessableEntityResponse()
  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }
}
