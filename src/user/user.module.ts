import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, UseGuards } from '@nestjs/common';
import { UserController } from '@app/user/user.controller';
import { UserEntity } from '@app/user/entity/user.entity';
import { UserService } from '@app/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
