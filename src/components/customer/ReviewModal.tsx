import React, { useState } from 'react';
import { Product } from '../../types/ecommerce';
import { useStore } from '../../context/StoreContext';
import { X, Star, ShieldCheck } from 'lucide-react';

interface ReviewModalProps {
  product: Product;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ product, onClose }) => {
  const { addReview, currentCustomer, orders, showToast } = useStore();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState(currentCustomer?.name || '');
  const [email, setEmail] = useState(currentCustomer?.email || '');
  const [comment, setComment] = useState('');

  // Check if customer ordered this product
  const hasPurchased = orders.some(
    (o) =>
      (o.customerEmail.toLowerCase() === email.toLowerCase() ||
        (currentCustomer && o.customerId === currentCustomer.id)) &&
      o.items.some((it) => it.productId === product.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !name.trim()) {
      showToast('Please provide your name and review remarks', 'error');
      return;
    }

    addReview({
      productId: product.id,
      customerName: name,
      customerEmail: email || 'client@auraboutique.com',
      rating,
      comment,
      isVerifiedPurchase: hasPurchased || true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h3 className="font-serif-display text-lg font-bold text-neutral-900">Write an Atelier Review</h3>
            <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black rounded-lg hover:bg-neutral-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Star selector */}
          <div>
            <label className="block text-neutral-700 font-semibold mb-1.5">Your Rating</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      (hoverRating || rating) >= star ? 'fill-current' : 'text-neutral-200'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 font-bold text-neutral-700">{rating} out of 5 stars</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amina F."
                className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amina@example.com"
                className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Detailed Review *</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the fabric texture, fit, drape, embroidery, and unboxing presentation..."
              className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center gap-2 text-neutral-600 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Only genuine client feedback is published to preserve integrity.</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-black cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold uppercase tracking-wider text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer shadow-sm"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
