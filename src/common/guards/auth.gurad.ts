import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
// import { User } from 'src/database/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        // @InjectRepository(User)
        // private readonly userRepository: Repository<User>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requestType = context.getType()

        let request: Request & { user: any } = context.switchToHttp().getRequest();


        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            request['user'] = payload;
            if (payload && !payload.deviceKey) {
                throw new UnauthorizedException();
            }
            // const user = await this.userRepository.findOne({ where: { id: payload.userId } });
            // if (user.activeStatus != true
            // ) {
            //     throw new UnauthorizedException();
            // }
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
