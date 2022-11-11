import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '@app/user/dto/createUser.dto';

export class CreateUserRequestDto {
  @ApiProperty()
  readonly user: CreateUserDto;
}
