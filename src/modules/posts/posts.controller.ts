import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PaginationDto } from '../utils/page-options.dto';
import { CreatePostDto, CommentDto } from './dto';
import { FetchPostDto } from './dto/query-params.dto';
import { AuthGuard } from 'src/guards';
import { User } from 'src/decorators';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('attachment'))
  async createPost(
    @UploadedFiles() files: any[],
    @Body() body: CreatePostDto,
    @User('_id') userId: string,
  ) {
    const res = await this.postService.createPost(body, files, userId);

    return { data: res, message: 'Post created', success: true };
  }

  @Get('/')
  @UseGuards(AuthGuard)
  async getPosts(@Query() query: FetchPostDto, @User('_id') userId: string) {
    const res = await this.postService.getAllPosts(query, userId);

    return {
      data: res,
      message: 'Posts fetched successfully',
      success: true,
    };
  }

  @Get('/:postId')
  @UseGuards(AuthGuard)
  async getPost(@Param('postId') postId: string, @User('_id') userId: string) {
    const res = await this.postService.getPost(postId, userId);

    return {
      data: res,
      message: 'post fetched successfully',
      success: true,
    };
  }

  @Post('/:postId/like')
  @UseGuards(AuthGuard)
  async likeOrUnlikePost(
    @Param('postId') postId: string,
    @User('_id') userId: string,
  ) {
    const res = await this.postService.likeOrUnlikePost(postId, userId);

    return {
      data: res,
      message: 'post action done successfully',
      success: true,
    };
  }

  @Post('/:postId/comments')
  @UseGuards(AuthGuard)
  async commentOrReply(
    @Param('postId') postId: string,
    @Body() dto: CommentDto,
    @User('_id') userId: string,
  ) {
    const res = dto.commentId
      ? await this.postService.addReply(dto, userId)
      : await this.postService.createComment({ ...dto, postId }, userId);

    return {
      data: res,
      message: 'Comment Posted successfully',
      success: true,
    };
  }

  @Get('/:postId/comments')
  @UseGuards(AuthGuard)
  async getPostComment(
    @Param('postId') postId: string,
    @Query() query: PaginationDto,
  ) {
    const res = await this.postService.getPostComment(postId, query);

    return {
      data: res,
      success: true,
      message: 'Comment fetched successfully',
    };
  }
}
