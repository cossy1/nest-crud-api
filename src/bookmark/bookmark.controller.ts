import { Controller, Get, Patch, Delete, Post, UseGuards, Param, ParseIntPipe, Body } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookMarkDto, EditBookMarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) { }

    @Get()
    getBookmarks(@GetUser('id') userId: number) {
        return this.bookmarkService.getBookmarks(userId);
    }

    @Get(':id')
    getBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {

        return this.bookmarkService.getBookmarkById(userId, bookmarkId);
    }

    @Post()
    createBookmark(@GetUser('id') userId: number, @Body() dto: CreateBookMarkDto) {
        return this.bookmarkService.createBookmark(userId, dto)
    }

    @Patch(':id')
    editBookmarkById(@GetUser('id') userId: number, @Body() dto: EditBookMarkDto, @Param('id', ParseIntPipe) id: number) {
        return this.bookmarkService.editBookmarkById(dto, id, userId)
    }

    @Delete(':id')
    deleteBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
    }

}
