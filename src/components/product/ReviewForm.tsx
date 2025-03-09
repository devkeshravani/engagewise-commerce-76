
import { useState } from 'react';
import { Star } from 'lucide-react';
import { addProductReview } from '@/lib/services';

interface ReviewFormProps {
  productId: string;
  onSubmitSuccess: () => void;
}

const ReviewForm = ({ productId, onSubmitSuccess }: ReviewFormProps) => {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName || rating === 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    const success = await addProductReview(
      productId,
      userName,
      rating,
      comment
    );
    
    setIsSubmitting(false);
    
    if (success) {
      // Reset form
      setUserName('');
      setRating(0);
      setComment('');
      onSubmitSuccess();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg">
      <h3 className="text-lg font-medium">Write a Review</h3>
      
      <div>
        <label htmlFor="userName" className="block text-sm font-medium mb-1">
          Your Name
        </label>
        <input
          id="userName"
          type="text"
          className="w-full px-3 py-2 border rounded-md"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Rating
        </label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="w-6 h-6 focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${
                  (hoverRating || rating) >= star
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500">
            {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
          </span>
        </div>
      </div>
      
      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-1">
          Your Review
        </label>
        <textarea
          id="comment"
          className="w-full px-3 py-2 border rounded-md min-h-[100px]"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      
      <div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
          disabled={isSubmitting || !userName || rating === 0}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
