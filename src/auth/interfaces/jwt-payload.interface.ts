import { UserRole } from '../../users/enums/user-role.enum';

export interface JwtPayload {
  userId: string;
  shopId: string;
  email: string;
  role: UserRole;
}
