import { UnauthorizedException, BadRequestException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';

export class AuthErrors {
    static EMAIL_ALREADY_EXISTS() {
        return new BadRequestException('Email already exists');
    }

    static INVALID_CREDENTIALS() {
        return new UnauthorizedException('Invalid credentials');
    }

    static INVALID_TOKEN() {
        return new UnauthorizedException('Invalid token');
    }

    static TOKEN_SERVICE_UNAVAILABLE() {
        return new ServiceUnavailableException('Token validation service unavailable');
    }

    static USER_NOT_FOUND() {
        return new NotFoundException('User not found');
    }

    static INTERNAL_ERROR() {
        return new BadRequestException('An error occurred');
    }

    static NO_FIELDS_TO_UPDATE() {
        return new BadRequestException('No fields to update');
    }
}