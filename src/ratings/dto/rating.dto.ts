import { IsNumber, Min, Max } from 'class-validator';

export class MovieRatingDto {
  @IsNumber()
  @Min(0.5)
  @Max(10)
  value: number;
}
export class TvRatingDto {
    @IsNumber()
    @Min(0.5)
    @Max(10)
    value: number;
  }