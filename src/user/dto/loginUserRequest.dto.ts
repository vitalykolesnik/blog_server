import { ApiProperty } from '@nestjs/swagger';
import { LoginUserDto } from '@app/user/dto/loginUser.dto';

export class LoginUserRequestDto {
  @ApiProperty()
  readonly user: LoginUserDto;
}
