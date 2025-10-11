import { useState, useEffect } from 'react';
import { useGetWalkInStaysByParkingLotQuery, useGetRemainingTimeQuery } from '../api/walkInStaysApi';
import { WalkInStayResponse, WalkInStayStatus } from '../types';
import {
  WALK_IN_STAY_CONSTANTS,
  WALK_IN_STAY_STATUS,
  formatDateTime,
  getStatusColor,
  formatRemainingTime,
} from '../constants/walkInStays';
import { WalkInStayDetailModal } from './modals/WalkInStayDetailModal';

const { DEFAULT_PAGE_SIZE } = WALK_IN_STAY_CONSTANTS.PAGINATION;

export function WalkInStayList({ 
  parkingLotId, 
  filters 
}: { 
  parkingLotId: number; 
  filters: any;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [selectedWalkInStay, setSelectedWalkInStay] = useState<WalkInStayResponse | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetWalkInStaysByParkingLotQuery({
    parkingLotId,
    page: currentPage - 1,
    size: itemsPerPage,
    ...filters,
  });

  const walkInStays = data?.data?.content ?? [];
  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;
  const currentPageNumber = data?.data?.pageNumber ?? 0;

  if (isLoading) return <div className="p-4 text-gray-500">Loading walk-in stays...</div>;
  if (isError)
    return (
      <div className="p-4 text-red-600">
        Error loading walk-in stays. <button onClick={refetch}>Retry</button>
      </div>
    );

  // No need for client-side slicing - API already returns paginated data
  const currentItems = walkInStays;

  const openWalkInStayDetails = (walkInStay: WalkInStayResponse) => {
    setSelectedWalkInStay(walkInStay);
  };

  const closeModal = () => {
    setSelectedWalkInStay(null);
  };

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Vehicle
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Spot
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Start Time
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Remaining Time
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.map((walkInStay) => (
                  <WalkInStayRow
                    key={walkInStay.id}
                    walkInStay={walkInStay}
                    onViewDetails={openWalkInStayDetails}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalElements > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{currentPageNumber * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min((currentPageNumber + 1) * itemsPerPage, totalElements)}
              </span>{' '}
              of <span className="font-medium">{totalElements}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
        </div>
      )}

      {/* Walk-In Stay Detail Modal */}
      {selectedWalkInStay && (
        <WalkInStayDetailModal
          isOpen={!!selectedWalkInStay}
          onClose={closeModal}
          walkInStay={selectedWalkInStay}
        />
      )}
    </div>
  );
}

// Component for individual table row with remaining time polling
function WalkInStayRow({ 
  walkInStay, 
  onViewDetails 
}: { 
  walkInStay: WalkInStayResponse; 
  onViewDetails: (walkInStay: WalkInStayResponse) => void;
}) {
  // Only poll remaining time for active stays
  const shouldPoll = walkInStay.status === WalkInStayStatus.ACTIVE;
  
  const {
    data: remainingTimeData,
    isLoading: isRemainingTimeLoading,
  } = useGetRemainingTimeQuery(walkInStay.id, {
    skip: !shouldPoll,
    pollingInterval: WALK_IN_STAY_CONSTANTS.POLLING.REMAINING_TIME_INTERVAL,
  });

  const remainingTime = remainingTimeData?.data;
  const isOvertime = remainingTime?.isOvertime || false;
  const remainingMinutes = remainingTime?.remainingMinutes || 0;

  return (
    <tr>
      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
        {walkInStay.vehicleLicensePlate}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
        {walkInStay.spotName}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
        {formatDateTime(walkInStay.startTime)}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
        {walkInStay.expectedDurationHours}h
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
        {shouldPoll ? (
          <div className="flex items-center">
            {isRemainingTimeLoading ? (
              <span className="text-gray-400">Loading...</span>
            ) : (
              <span className={`${isOvertime ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                {formatRemainingTime(remainingMinutes)}
              </span>
            )}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm">
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
            walkInStay.status
          )}`}
        >
          {WALK_IN_STAY_STATUS[walkInStay.status]?.label || walkInStay.status}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-right">
        <button
          onClick={() => onViewDetails(walkInStay)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          View
        </button>
      </td>
    </tr>
  );
}

export default WalkInStayList;
