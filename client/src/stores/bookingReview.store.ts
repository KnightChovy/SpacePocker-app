import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BookingReviewState {
  reviewedBookingIds: Record<string, true>;
  reviewedRoomIds: Record<string, true>;

  isBookingReviewed: (bookingRequestId?: string | null) => boolean;
  isRoomReviewed: (roomId?: string | null) => boolean;

  markBookingReviewed: (bookingRequestId: string) => void;
  markRoomReviewed: (roomId: string) => void;
  markReviewed: (input: { bookingRequestId?: string | null; roomId?: string | null }) => void;

  clearAll: () => void;
}

export const useBookingReviewStore = create<BookingReviewState>()(
  persist(
    (set, get) => ({
      reviewedBookingIds: {},
      reviewedRoomIds: {},

      isBookingReviewed: bookingRequestId => {
        if (!bookingRequestId) return false;
        return Boolean(get().reviewedBookingIds[bookingRequestId]);
      },

      isRoomReviewed: roomId => {
        if (!roomId) return false;
        return Boolean(get().reviewedRoomIds[roomId]);
      },

      markBookingReviewed: bookingRequestId =>
        set(state => ({
          reviewedBookingIds: {
            ...state.reviewedBookingIds,
            [bookingRequestId]: true,
          },
        })),

      markRoomReviewed: roomId =>
        set(state => ({
          reviewedRoomIds: {
            ...state.reviewedRoomIds,
            [roomId]: true,
          },
        })),

      markReviewed: ({ bookingRequestId, roomId }) => {
        if (bookingRequestId) get().markBookingReviewed(bookingRequestId);
        if (roomId) get().markRoomReviewed(roomId);
      },

      clearAll: () => set({ reviewedBookingIds: {}, reviewedRoomIds: {} }),
    }),
    {
      name: 'spacepocker-booking-review-storage',
      partialize: state => ({
        reviewedBookingIds: state.reviewedBookingIds,
        reviewedRoomIds: state.reviewedRoomIds,
      }),
    }
  )
);
