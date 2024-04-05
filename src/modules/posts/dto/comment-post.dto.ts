import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  commentId?: string;
}
