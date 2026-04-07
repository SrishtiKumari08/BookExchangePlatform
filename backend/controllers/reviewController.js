import Review from "../models/Review.js";
import User from "../models/User.js";
import Exchange from "../models/Exchange.js";

// @desc    Create a review for an exchange
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
    try {
        const { exchangeId, rating, comment } = req.body;
        const reviewerId = req.user.id;

        const exchange = await Exchange.findById(exchangeId).populate('book');
        
        if (!exchange) {
            return res.status(404).json({ message: "Exchange not found" });
        }

        if (exchange.status !== 'accepted') {
            return res.status(400).json({ message: "Can only review completed exchanges" });
        }

        // Determine who is being reviewed
        let revieweeId;
        if (exchange.requester.toString() === reviewerId) {
            revieweeId = exchange.book.owner;
        } else if (exchange.book.owner.toString() === reviewerId) {
            revieweeId = exchange.requester;
        } else {
            return res.status(403).json({ message: "Not a part of this exchange" });
        }

        const review = await Review.create({
            reviewer: reviewerId,
            reviewee: revieweeId,
            exchange: exchangeId,
            rating,
            comment
        });

        // Update target user's average rating
        const reviews = await Review.find({ reviewee: revieweeId });
        const avg = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        
        await User.findByIdAndUpdate(revieweeId, { averageRating: avg.toFixed(1) });

        res.status(201).json({ message: "Review added successfully", review });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "You have already reviewed this exchange" });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user reviews
// @route   GET /api/reviews/:userId
// @access  Public
export const getUserReviews = async (req, res) => {
    try {
        const { userId } = req.params;
        const reviews = await Review.find({ reviewee: userId })
            .populate('reviewer', 'name profilePicture');
        
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
