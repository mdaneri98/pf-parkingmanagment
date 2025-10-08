import { ReservationStatus } from '../types';

// ====== Reservation Constants ======
export const RESERVATION_CONSTANTS = {
    VALIDATION: {
        MIN_PRICE: 0,
        MAX_PRICE: 9999.99,
        MAX_LICENSE_PLATE_LENGTH: 10,
    },
    FORMATTING: {
        CURRENCY_SYMBOL: '$',
        CURRENCY_LOCALE: 'en-US',
        DATE_FORMAT: 'MMM DD, YYYY',
        TIME_FORMAT: 'HH:mm',
        DATETIME_FORMAT: 'MMM DD, YYYY HH:mm',
    },
    SORT: {
        DEFAULT: 'reservedStartTime' as const,
        DIRECTION: 'desc' as const,
        OPTIONS: ['reservedStartTime', 'expectedEndTime', 'status', 'estimatedPrice'] as const,
    },
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
    },
} as const;

// ====== Status Configuration ======
export const RESERVATION_STATUS = {
    [ReservationStatus.PENDING]: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800',
    },
    [ReservationStatus.CONFIRMED]: {
        label: 'Confirmed',
        color: 'bg-green-100 text-green-800',
    },
    [ReservationStatus.CANCELLED]: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-800',
    },
    [ReservationStatus.COMPLETED]: {
        label: 'Completed',
        color: 'bg-blue-100 text-blue-800',
    },
    [ReservationStatus.IN_USE]: {
        label: 'In Use',
        color: 'bg-purple-100 text-purple-800',
    },
    [ReservationStatus.NO_SHOW]: {
        label: 'No Show',
        color: 'bg-gray-100 text-gray-800',
    },
} as const;

// ====== Error Messages ======
export const RESERVATION_ERROR_MESSAGES = {
    RESERVATION: {
        NOT_FOUND: 'Reservation not found',
        LOAD_FAILED: 'Failed to load reservations',
        UPDATE_FAILED: 'Failed to update reservation',
        CANCEL_FAILED: 'Failed to cancel reservation',
        CREATE_FAILED: 'Failed to create reservation',
    },
    VALIDATION: {
        VEHICLE_REQUIRED: 'Vehicle is required',
        SPOT_REQUIRED: 'Parking spot is required',
        START_TIME_REQUIRED: 'Start time is required',
        END_TIME_REQUIRED: 'End time is required',
        END_TIME_AFTER_START: 'End time must be after start time',
        LICENSE_PLATE_REQUIRED: 'License plate is required',
        LICENSE_PLATE_MAX: `License plate cannot exceed ${RESERVATION_CONSTANTS.VALIDATION.MAX_LICENSE_PLATE_LENGTH} characters`,
    },
    NETWORK: {
        CONNECTION_ERROR: 'Connection error. Please check your internet connection.',
        TIMEOUT: 'Request timed out. Please try again.',
        SERVER_ERROR: 'Server error. Please try again later.',
        UNAUTHORIZED: 'You are not authorized to view these reservations.',
    },
} as const;

// ====== Success Messages ======
export const RESERVATION_SUCCESS_MESSAGES = {
    CREATED: 'Reservation created successfully',
    UPDATED: 'Reservation updated successfully',
    CANCELLED: 'Reservation cancelled successfully',
} as const;

// ====== Utility Functions ======

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(RESERVATION_CONSTANTS.FORMATTING.CURRENCY_LOCALE, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

export const formatDateTime = (dateString: string, includeTime = true): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.hour12 = true;
    }

    return date.toLocaleString(RESERVATION_CONSTANTS.FORMATTING.CURRENCY_LOCALE, options);
};

export const isReservationActive = (startTime: string, endTime: string): boolean => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return now >= start && now <= end;
};

export const isReservationUpcoming = (startTime: string): boolean => {
    return new Date(startTime) > new Date();
};

export const getStatusLabel = (status: ReservationStatus): string => {
    return RESERVATION_STATUS[status]?.label || status;
};

export const getStatusColor = (status: ReservationStatus): string => {
    return RESERVATION_STATUS[status]?.color || 'bg-gray-100 text-gray-800';
};