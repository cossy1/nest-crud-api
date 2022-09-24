import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class EditUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsString()
    @IsOptional()
    lastName?: string

    @IsString()
    @IsOptional()
    firstName?: string

}