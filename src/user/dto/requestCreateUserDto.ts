import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '@app/user/dto/createUserDto.dto';

export class RequestCreateUserDto {
  @ApiProperty()
  readonly user: CreateUserDto;
}
