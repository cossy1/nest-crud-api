import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateBookMarkDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    link: string;

    @IsString()
    @IsOptional()
    description?: string
}