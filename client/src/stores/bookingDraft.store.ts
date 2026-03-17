import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BookingDraft = {
  roomId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  purpose: string;
  amenityIds: string[];
  services: Record<string, number>;
  updatedAt: string;
};

export type LocalBookingRecord = {
  bookingRequestId: string;
  roomId: string;
  startTime: string;
  endTime: string;
  purpose?: string;
  amenityIds: string[];
  services: Array<{ serviceId: string; quantity: number }>;
  savedAt: string;
};

interface BookingDraftState {
  draftsByRoomId: Record<string, BookingDraft>;
  localBookingsById: Record<string, LocalBookingRecord>;

  getDraft: (roomId: string) => BookingDraft | undefined;
  upsertDraft: (draft: BookingDraft) => void;
  clearDraft: (roomId: string) => void;

  addLocalBooking: (record: LocalBookingRecord) => void;
}

export const useBookingDraftStore = create<BookingDraftState>()(
  persist(
    (set, get) => ({
      draftsByRoomId: {},
      localBookingsById: {},

      getDraft: (roomId: string) => get().draftsByRoomId[roomId],

      upsertDraft: (draft: BookingDraft) =>
        set(state => ({
          draftsByRoomId: {
            ...state.draftsByRoomId,
            [draft.roomId]: draft,
          },
        })),

      clearDraft: (roomId: string) =>
        set(state => {
          const next = { ...state.draftsByRoomId };
          delete next[roomId];
          return { draftsByRoomId: next };
        }),

      addLocalBooking: (record: LocalBookingRecord) =>
        set(state => ({
          localBookingsById: {
            ...state.localBookingsById,
            [record.bookingRequestId]: record,
          },
        })),
    }),
    {
      name: 'spacepocker-booking-storage',
      partialize: state => ({
        draftsByRoomId: state.draftsByRoomId,
        localBookingsById: state.localBookingsById,
      }),
    }
  )
);
