import { UserRole } from '../../users/enums/user-role.enum';

export interface AuthenticatedUser {
  userId: string;
  shopId: string;
  email: string;
  role: UserRole;
}
