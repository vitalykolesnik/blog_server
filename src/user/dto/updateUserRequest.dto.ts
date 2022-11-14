import { ApiProperty } from '@nestjs/swagger';
import { UpdateUserDto } from '@app/user/dto/updateUser.dto';

export class UpdateUserRequestDto {
  @ApiProperty()
  readonly user: UpdateUserDto;
}
