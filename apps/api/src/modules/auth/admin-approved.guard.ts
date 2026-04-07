import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AdminApprovalStatus } from '@prisma/client';

@Injectable()
export class AdminApprovedGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();

    if (!user?.sub) {
      return false;
    }

    // Get user with admin approval status from database
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
      include: { role: true },
    });

    if (!dbUser || dbUser.role.name !== 'ADMIN') {
      return true; // Not an admin, allow other guards to handle
    }

    // Admin user found - check approval status
    if (dbUser.adminApprovalStatus !== AdminApprovalStatus.APPROVED) {
      throw new ForbiddenException(
        'Your admin account is pending approval from the primary admin. Please wait for approval.',
      );
    }

    return true;
  }
}
