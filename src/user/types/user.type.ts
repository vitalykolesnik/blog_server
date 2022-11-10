import { UserEntity } from '@app/user/entity/user.entity';

export type UserType = Omit<UserEntity, 'hashPassword'>;
