import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
	constructor(
		@InjectModel(Review.name)
		private readonly reviewModel: Model<ReviewDocument>,
	) {}

	async create(createReviewDto: CreateReviewDto): Promise<Review> {
		const createdReview = new this.reviewModel({
			...createReviewDto,
			user: new Types.ObjectId(createReviewDto.user),
			product: new Types.ObjectId(createReviewDto.product),
			merchant: new Types.ObjectId(createReviewDto.merchant),
		});
		return createdReview.save();
	}

	async findAll(): Promise<Review[]> {
		return this.reviewModel.find().exec();
	}

	async findById(id: string): Promise<Review> {
		const review = await this.reviewModel.findById(id).exec();
		if (!review) {
			throw new NotFoundException('Review not found');
		}
		return review;
	}

	async findByProduct(productId: string): Promise<Review[]> {
		return this.reviewModel
			.find({ product: new Types.ObjectId(productId) })
			.exec();
	}

	async findByMerchant(merchantId: string): Promise<Review[]> {
		return this.reviewModel
			.find({ merchant: new Types.ObjectId(merchantId) })
			.exec();
	}

	async findByUser(userId: string): Promise<Review[]> {
		return this.reviewModel
			.find({ user: new Types.ObjectId(userId) })
			.exec();
	}

	async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
		const review = await this.findById(id);
		if (!review) {
			throw new NotFoundException('Review not found');
		}

		const updatedReview = await this.reviewModel
			.findByIdAndUpdate(id, updateReviewDto, { new: true })
			.exec();

		return updatedReview as Review;
	}

	async remove(id: string): Promise<void> {
		const result = await this.reviewModel.deleteOne({ _id: id }).exec();
		if (result.deletedCount === 0) {
			throw new NotFoundException('Review not found');
		}
	}

	async updateRating(id: string, rating: number): Promise<Review> {
		const review = await this.findById(id);
		if (!review) {
			throw new NotFoundException('Review not found');
		}

		if (rating < 1 || rating > 5) {
			throw new BadRequestException('Rating must be between 1 and 5');
		}

		const updatedReview = await this.reviewModel
			.findByIdAndUpdate(
				id,
				{ rating },
				{ new: true },
			)
			.exec();

		return updatedReview as Review;
	}

	async updateContent(id: string, content: string): Promise<Review> {
		const review = await this.findById(id);
		if (!review) {
			throw new NotFoundException('Review not found');
		}

		const updatedReview = await this.reviewModel
			.findByIdAndUpdate(
				id,
				{ content },
				{ new: true },
			)
			.exec();

		return updatedReview as Review;
	}

	async markAsHelpful(id: string, userId: string): Promise<Review> {
		const review = await this.findById(id);
		if (!review) {
			throw new NotFoundException('Review not found');
		}

		const userObjectId = new Types.ObjectId(userId);
		if (review.helpfulUsers.includes(userObjectId)) {
			throw new BadRequestException('User has already marked this review as helpful');
		}

		const updatedReview = await this.reviewModel
			.findByIdAndUpdate(
				id,
				{
					$push: { helpfulUsers: userObjectId },
					$inc: { helpfulCount: 1 },
				},
				{ new: true },
			)
			.exec();

		return updatedReview as Review;
	}

	async unmarkAsHelpful(id: string, userId: string): Promise<Review> {
		const review = await this.findById(id);
		if (!review) {
			throw new NotFoundException('Review not found');
		}

		const userObjectId = new Types.ObjectId(userId);
		const userIndex = review.helpfulUsers.indexOf(userObjectId);
		if (userIndex === -1) {
			throw new BadRequestException('User has not marked this review as helpful');
		}

		const updatedReview = await this.reviewModel
			.findByIdAndUpdate(
				id,
				{
					$pull: { helpfulUsers: userObjectId },
					$inc: { helpfulCount: -1 },
				},
				{ new: true },
			)
			.exec();

		return updatedReview as Review;
	}
}
