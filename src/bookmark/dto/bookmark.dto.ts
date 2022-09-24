import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class BookMarkDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string
}