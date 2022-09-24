import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto/auth.dto";
import * as Argon from 'argon2'
import { Prisma } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";


@Injectable()

export class AuthService {

    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }

    async signin(dto: AuthDto) {

        // find the user email with prisma.
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        // throw an error if user not found.
        if (!user)
            throw new ForbiddenException("Email does not exist");

        // check password match with argon verify.
        const passwordMatch = await Argon.verify(user.hash, dto.password);

        if (!passwordMatch)
            throw new ForbiddenException("Incorrect Password");

        // send back the user
        return this.signToken(user.id, user.email);

    }

    async signup(dto: AuthDto) {
        // generate the password hash
        const hash = await Argon.hash(dto.password);

        // save the new user

        let user: Record<string, any>;

        try {
            user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash
                }

            })
        }
        catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                if (err.code === 'P2002')
                    throw new ForbiddenException("A user with this email already exists")
            }

            throw err;

        }

        return {
            message: "Account successfully created",
            data: {
                email: user.email
            }
        };
    }


    async signToken(userId: number, email: string): Promise<{access_token: string}> {
        const payload = {
            sub: userId,
            email
        }

        const secret = this.config.get("JWT_SECRET")

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '20m',
            secret
        })
        

        return {
            access_token: token
        }
    }

}