import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthErrors } from 'src/utils/auth_error_response';
import { RegisterUserDto } from './dto/register-input.dto';
import { LoginUserDto } from './dto/login-input.dto';
import { loginSchema, registerSchema } from './schema/auth.schema';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(input: RegisterUserDto): Promise<{ token: string; user: any }> {
        try {
            const validatedData = registerSchema.parse(input);
            const hashedPassword = await bcrypt.hash(validatedData.password, 10);

            const user = await this.prisma.user.create({
                data: {
                    email: validatedData.email,
                    password: hashedPassword,
                    name: validatedData.name,
                    phoneNumber: validatedData.phoneNumber ?? "",
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
                },
            });

            const token = this.signToken(user.id, user.email);

            return { token, user };
        } catch (error) {
            if (error.code === 'P2002') {
                throw AuthErrors.EMAIL_ALREADY_EXISTS();
            }

            throw AuthErrors.INTERNAL_ERROR();
        }
    }

    async login(input: LoginUserDto): Promise<{ token: string; user: any }> {
        const validatedData = loginSchema.parse(input);

        const user = await this.prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (!user) {
            throw AuthErrors.INVALID_CREDENTIALS();
        }

        const isValid = await bcrypt.compare(validatedData.password, user.password);

        if (!isValid) {
            throw AuthErrors.INVALID_CREDENTIALS();
        }

        const token = this.signToken(user.id, user.email);

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }

    async validateToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);

            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            });

            if (!user) {
                throw AuthErrors.INVALID_TOKEN();
            }

            return user;
        } catch (error) {
            throw AuthErrors.INVALID_TOKEN();
        }
    }

    private signToken(userId: string, email: string): string {
        return this.jwtService.sign({
            sub: userId,
            email,
        });
    }
}