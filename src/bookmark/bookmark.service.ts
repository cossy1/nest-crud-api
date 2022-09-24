import { Body, ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookMarkDto, EditBookMarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });

    return bookmarks;
  }

  async getBookmarkById(@GetUser('id') userId: number, bookmarkId: number) {
    let bookmark: Record<string, any>;

    try {
      bookmark = await this.prisma.bookmark.findFirst({
        where: {
          id: bookmarkId,
          userId,
        },
      });
    } catch (err) {
      throw err;
    }

    return bookmark
      ? bookmark
      : {
          message: `Bookmark with id ${bookmarkId} not found`,
          status: 404,
        };
  }

  async createBookmark(userId: number, @Body() dto: CreateBookMarkDto) {
    try {
      await this.prisma.bookmark.create({
        data: {
          userId,
          ...dto,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002')
          throw new ForbiddenException('Title must be unique');
      }

      throw err;
    }

    return {
      message: 'Bookmark successfully created',
      status: 201,
    };
  }

  async editBookmarkById(
    @Body() dto: EditBookMarkDto,
    id: number,
    userId: number,
  ) {
    try {
      await this.prisma.bookmark.update({
        where: {
          id,
        },

        data: {
          ...dto,
          userId,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002')
          throw new ForbiddenException('Title must be unique');
      }

      throw err;
    }

    return {
      message: 'Bookmark successfully updated',
      status: 200,
    };
  }

  async deleteBookmarkById(@GetUser('id') userId: number, id: number) {
    try {
      await this.prisma.bookmark.delete({
        where: {
          id,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025')
          throw new ForbiddenException(
            `Bookmark with an id of ${id} doesn't exist`,
          );
      } else {
        throw new ForbiddenException(`An error occured.`);
      }

      throw err;
    }

    return {
      message: 'Bookmark deleted successfully',
      status: 200,
    };
  }
}
