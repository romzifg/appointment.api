import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthErrors } from 'src/utils/auth_error_response';
import { EditUserDto } from './dto/edit-input.dto';
import { updateUserSchema } from './schema/user.schema';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
    ) { }

    private async prepareUpdateData(input: Partial<EditUserDto>): Promise<Record<string, any>> {
        const updateData: Record<string, any> = {};

        Object.entries(input).forEach(([key, value]) => {
            if (value !== undefined) {
                updateData[key] = value;
            }
        });

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        return updateData;
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                phoneNumber: true,
                gender: true
            },
        });

        if (!user) {
            throw AuthErrors.USER_NOT_FOUND();
        }

        return user;
    }

    async updateUser(userId: string, input: EditUserDto) {
        try {
            const validatedData = updateUserSchema.parse(input);
            const updateData = await this.prepareUpdateData(validatedData)

            if (Object.keys(updateData).length === 0) {
                throw AuthErrors.NO_FIELDS_TO_UPDATE();
            }

            const user = await this.prisma.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    gender: true,
                    phoneNumber: true,
                    updatedAt: true,
                },
            });

            return user;
        } catch (error) {
            if (error.code === 'P2002') {
                throw AuthErrors.EMAIL_ALREADY_EXISTS();
            }
            if (error.code === 'P2025') {
                throw AuthErrors.USER_NOT_FOUND();
            }

            throw AuthErrors.INTERNAL_ERROR();
        }
    }

    async deleteUser(userId: string) {
        try {
            await this.prisma.user.delete({
                where: { id: userId },
            });

            return { message: 'User deleted successfully' };
        } catch (error) {
            if (error.code === 'P2025') {
                throw AuthErrors.USER_NOT_FOUND();
            }

            throw AuthErrors.INTERNAL_ERROR();
        }
    }
}