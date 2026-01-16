"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, addMinutes, isBefore, startOfToday } from "date-fns";
import { api } from "~/trpc/react";
import "react-day-picker/dist/style.css";

interface BookingCalendarProps {
  serviceId: string;
  serviceDuration: number;
  onBookingComplete?: () => void;
}

export function BookingCalendar({
  serviceId,
  serviceDuration,
  onBookingComplete,
}: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");

  const utils = api.useUtils();

  // Fetch available slots when a date is selected
  const { data: availableSlots, isLoading: slotsLoading } =
    api.booking.getAvailableSlots.useQuery(
      { serviceId, date: selectedDate! },
      { enabled: !!selectedDate }
    );

  // Create booking mutation
  const createBooking = api.booking.create.useMutation({
    onSuccess: async () => {
      await utils.booking.invalidate();
      setSelectedSlot(null);
      setSelectedDate(undefined);
      setNotes("");
      onBookingComplete?.();
    },
  });

  const handleBooking = () => {
    if (!selectedSlot) return;
    createBooking.mutate({
      serviceId,
      startTime: selectedSlot,
      notes: notes || undefined,
    });
  };

  // Disable past dates
  const disabledDays = { before: startOfToday() };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Calendar Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Select a Date
        </h3>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={disabledDays}
          showOutsideDays
          className="rdp-custom"
          classNames={{
            day: "h-10 w-10 rounded-full hover:bg-blue-100 transition-colors",
            selected: "!bg-blue-600 !text-white hover:!bg-blue-700",
            today: "font-bold text-blue-600",
            disabled: "text-gray-300 cursor-not-allowed",
          }}
        />
      </div>

      {/* Time Slots Section */}
      <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {selectedDate
            ? `Available Times for ${format(selectedDate, "MMMM d, yyyy")}`
            : "Select a date to view available times"}
        </h3>

        {!selectedDate && (
          <p className="text-gray-500">
            Please select a date from the calendar to see available time slots.
          </p>
        )}

        {selectedDate && slotsLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {selectedDate && availableSlots && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {availableSlots.map((slot) => {
              const slotTime = new Date(slot.startTime);
              const endTime = addMinutes(slotTime, serviceDuration);
              const isPast = isBefore(slotTime, new Date());
              const isSelected =
                selectedSlot?.getTime() === slotTime.getTime();

              return (
                <button
                  key={slotTime.toISOString()}
                  onClick={() =>
                    slot.available && !isPast && setSelectedSlot(slotTime)
                  }
                  disabled={!slot.available || isPast}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : slot.available && !isPast
                        ? "border-gray-200 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                        : "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                  }`}
                >
                  {format(slotTime, "h:mm a")}
                </button>
              );
            })}
          </div>
        )}

        {selectedDate && availableSlots?.length === 0 && (
          <p className="py-4 text-center text-gray-500">
            No available slots for this date. Please select another date.
          </p>
        )}
      </div>

      {/* Booking Summary Section */}
      {selectedSlot && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm lg:w-80">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Booking Summary
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium text-gray-900">
                {format(selectedSlot, "EEEE, MMMM d, yyyy")}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium text-gray-900">
                {format(selectedSlot, "h:mm a")} -{" "}
                {format(addMinutes(selectedSlot, serviceDuration), "h:mm a")}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium text-gray-900">
                {serviceDuration} minutes
              </p>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm text-gray-500"
              >
                Notes (optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests..."
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <button
              onClick={handleBooking}
              disabled={createBooking.isPending}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {createBooking.isPending ? "Booking..." : "Confirm Booking"}
            </button>

            {createBooking.isError && (
              <p className="text-sm text-red-600">
                {createBooking.error.message}
              </p>
            )}

            {createBooking.isSuccess && (
              <p className="text-sm text-green-600">
                Booking confirmed! Check your bookings for details.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
