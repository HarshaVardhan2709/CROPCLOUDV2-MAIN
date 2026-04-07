import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RoleType } from '@prisma/client';
import * as argon2 from 'argon2';
import type { SignOptions } from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, SignupDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const role = await this.prisma.role.findUnique({ where: { name: dto.role } });
    if (!role) {
      throw new UnauthorizedException('Invalid role');
    }

    // Check if user is signing up as ADMIN
    let isPrimaryAdmin = false;
    let adminApprovalStatus: 'APPROVED' | 'PENDING' | undefined = undefined;

    if (dto.role === RoleType.ADMIN) {
      // Check if there's already an admin in the system
      const existingAdmin = await this.prisma.user.findFirst({
        where: {
          role: { name: RoleType.ADMIN },
        },
      });

      if (!existingAdmin) {
        // First admin - make them primary and auto-approve
        isPrimaryAdmin = true;
        adminApprovalStatus = 'APPROVED';
      } else {
        // Not first admin - set to pending approval
        isPrimaryAdmin = false;
        adminApprovalStatus = 'PENDING';
      }
    }

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        phone: dto.phone,
        roleId: role.id,
        isPrimaryAdmin,
        adminApprovalStatus,
        buyerProfile:
          dto.role === RoleType.BUYER
            ? {
                create: {
                  companyName: dto.companyName ?? dto.fullName,
                },
              }
            : undefined,
        sellerProfile:
          dto.role === RoleType.SELLER
            ? {
                create: {
                  businessName: dto.businessName ?? `${dto.fullName} Farms`,
                },
              }
            : undefined,
        cart: { create: {} },
        wishlist: { create: {} },
      },
      include: {
        role: true,
        buyerProfile: true,
        sellerProfile: true,
      },
    });

    const tokens = await this.issueTokens(user.id, user.email, user.fullName, user.role.name) as any;

    // Add warning if admin signup is pending approval
    if (dto.role === RoleType.ADMIN && adminApprovalStatus === 'PENDING') {
      return {
        ...tokens,
        warning: 'Your admin account has been created but requires approval from the primary admin. You cannot access admin features until approved.',
        adminStatus: 'PENDING_APPROVAL',
      };
    }

    // Add success message for first admin signup
    if (dto.role === RoleType.ADMIN && adminApprovalStatus === 'APPROVED') {
      return {
        ...tokens,
        message: 'Welcome primary admin! You have full access to admin features.',
        adminStatus: 'APPROVED',
      };
    }

    return tokens;
  }

  async login(dto: LoginDto) {
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email },
    include: { role: true },
  });

  if (!user || !(await argon2.verify(user.passwordHash, dto.password))) {
    throw new UnauthorizedException('Invalid credentials');
  }

  
  await this.prisma.loginLog.create({
    data: {
      userId: user.id,
    },
  });

  const tokens = await this.issueTokens(
    user.id,
    user.email,
    user.fullName,
    user.role.name
  );

  // Add warning if admin is pending approval
  if (user.role.name === RoleType.ADMIN && user.adminApprovalStatus === 'PENDING') {
    return {
      ...tokens,
      warning: 'Your admin account is pending approval from the primary admin. You cannot access admin features until approved.',
    };
  }

  return tokens;
}

  async refresh(refreshToken: string) {
    let payload: { sub: string };

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true },
    });
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token invalid');
    }
    const valid = await argon2.verify(user.refreshTokenHash, refreshToken);
    if (!valid) {
      throw new UnauthorizedException('Refresh token invalid');
    }
    return this.issueTokens(user.id, user.email, user.fullName, user.role.name);
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { success: true };
  }

  private async issueTokens(userId: string, email: string, fullName: string, role: RoleType) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email, role },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: (process.env.JWT_ACCESS_TTL ?? '15m') as SignOptions['expiresIn'],
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, email, role },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: (process.env.JWT_REFRESH_TTL ?? '7d') as SignOptions['expiresIn'],
      },
    );
    const refreshTokenHash = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email,
        fullName,
        role,
      },
    };
  }
}
