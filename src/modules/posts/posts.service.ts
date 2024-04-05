import { Injectable } from '@nestjs/common';
import { ErrorHelper } from 'src/helpers/error.utils';
import { CreatePostDto, CommentDto } from './dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Comment } from './schemas';
import { FetchPostDto } from './dto/query-params.dto';
import { PaginationResultDto } from '../utils/pagination.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postRepository: Model<Post>,
    @InjectModel(Comment.name) private commentRepo: Model<Comment>,
  ) {}

  async createPost(dto: CreatePostDto, attachment: any[], userId: string) {
    let attachments = [];
    if (attachment) {
      attachments = await Promise.all(
        attachment.map(async (a) => ({
          //   url: await this.awsS3Service.uploadAttachment(a),
          type: a?.mimetype,
          name: a?.originalname,
          size: a?.size,
        })),
      );
    }

    const data = await this.postRepository.create({
      user: userId,
      content: dto.content,
      title: dto.title,
      attachments,
    });

    return data;
  }

  async createComment(dto: CommentDto, userId: string) {
    const post = await this.postRepository.findById(dto.postId);

    if (!post) {
      ErrorHelper.NotFoundException('Post does not exist');
    }

    await this.commentRepo.create({
      user: userId,
      content: dto.content,
      post: dto.postId,
    });

    return true;
  }

  async getAllPosts(query: FetchPostDto, userId: string) {
    const { search, skip, limit, topRated } = query;

    const filter = search ? { title: new RegExp(search, 'gi') } : {};
    const postList = await this.postRepository.findSelected(
      filter,
      skip,
      limit,
      topRated,
    );
    const posts = postList.map((p) => this.parsePost(p, userId));
    const postCount = await this.postRepository.count(filter);

    return new PaginationResultDto(posts, postCount, query);
  }

  async getPostComment(postId: string, paginationDto: PaginationDto) {
    const { skip, limit } = paginationDto;

    const filter = { post: postId };
    const comments = await this.commentRepo.findSelected(filter, skip, limit);
    const commentCount = await this.commentRepo.count(filter);

    return new PaginationResultDto(comments, commentCount, paginationDto);
  }

  async getPost(postId: string, userId: string) {
    const post = await this.postRepository.findById(postId);

    if (!post) {
      ErrorHelper.NotFoundException('Post not found');
    }

    return this.parsePost(post, userId);
  }

  async likeOrUnlikePost(postId: string, userId: string) {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      ErrorHelper.NotFoundException('Post not found');
    }
    let updatedlikes = post.likes || [];
    const likeIndex = updatedlikes.findIndex((x) => x.user === userId);
    const hasLiked = likeIndex >= 0;
    if (hasLiked) {
      updatedlikes = updatedlikes.filter((x) => x.user !== userId);
    } else {
      updatedlikes.push({
        user: userId,
        emoji: 'thumbs_up',
      });
    }
    return this.postRepository.updateLikes(postId, updatedlikes);
  }

  private parsePost(p: Post, userId: string) {
    const likes = p.likes || [];
    return {
      ...p,
      hasLiked: likes.some((x) => x.user === userId),
    };
  }

  async addReply(dto: CommentDto, userId: string) {
    
    const comment = await this.commentRepo.findById(dto.commentId);

    if (!comment) {
      ErrorHelper.NotFoundException('Comment does not exist');
    }

    return this.commentRepo.addReply(dto.commentId, { content: dto.content, user: userId });
  }˝
}
