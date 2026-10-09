import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, ShieldCheck, Eye, EyeOff, Trash2 } from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const { reviews, updateReviewStatus, deleteReview, products } = useStore();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs">
        <h1 className="font-serif-display text-2xl font-bold text-neutral-900">
          Client Feedback & Verified Reviews
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Moderate buyer submissions, verify purchases, and ensure verified testimonial integrity.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden">
        <div className="divide-y divide-neutral-100 text-xs">
          {reviews.length === 0 ? (
            <p className="p-8 text-center text-neutral-400">No client reviews submitted yet.</p>
          ) : (
            reviews.map((rev) => {
              const product = products.find((p) => p.id === rev.productId);

              return (
                <div key={rev.id} className="p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900">{rev.customerName}</span>
                      <span className="text-neutral-400 text-[11px]">({rev.customerEmail})</span>
                      {rev.isVerifiedPurchase && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified Purchase</span>
                        </span>
                      )}
                      <span className="text-[11px] text-neutral-400">· {rev.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-neutral-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-neutral-500 text-[11px]">
                        Review for: <strong>{product?.name || 'Item'}</strong>
                      </span>
                    </div>

                    <p className="text-neutral-700 leading-relaxed italic">"{rev.comment}"</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() =>
                        updateReviewStatus(rev.id, rev.status === 'approved' ? 'hidden' : 'approved')
                      }
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                        rev.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {rev.status === 'approved' ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Approved</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => deleteReview(rev.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
