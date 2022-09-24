import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("JWT_SECRET"),
    });
  }

   async validate(payload: {
    email: string,
    sub: number
  }){
    const user = this.prisma.user.findUnique({
        where: {
            id: payload.sub
        }
    })
    delete (await user).hash

    return user
  }
  
}