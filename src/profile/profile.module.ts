import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '@app/user/user.service';
import { ProfileController } from '@app/profile/profile.controller';
import { UserEntity } from '@app/user/entity/user.entity';
import { ProfileService } from '@app/profile/profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
