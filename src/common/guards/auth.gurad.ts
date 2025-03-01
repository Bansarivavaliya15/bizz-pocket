import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';
// import { User } from 'src/database/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        try {
            let request: Request & { user: any } = context.switchToHttp().getRequest();
            const token = this.extractTokenFromHeader(request);
            if (!token) {
                throw new UnauthorizedException();
            }

            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            request['user'] = payload.user
            const user = await this.userModel.findOne({ _id: payload.userId });
            if (user.isDeleted == true || user.deviceToken != payload.deviceToken) {
                throw new UnauthorizedException();
            }
            return true;
        } catch {
            throw new UnauthorizedException();
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
