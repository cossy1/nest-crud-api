import { IsOptional, IsString } from "class-validator"

export class EditUserDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsString()
    @IsOptional()
    lastName?: string

    @IsString()
    @IsOptional()
    firstName?: string

}