import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ConfirmDeleteModal } from '@shared/ui/components';
import { PricesHeader } from './PricesHeader';
import { PriceFormModal } from './forms/PriceFormModal';
import { PriceDetailModal } from './modals/PriceDetailModal';
import { PriceFilters } from './filters/PriceFilters';
import { PricesGrid, PricesStats } from './grids/PricesGrid';
import {
  usePricesData,
  usePriceMutations,
} from '@prices/hooks';
import {
  selectSelectedPrice,
  selectPriceModalState,
  selectPriceConfirmDeleteState,
  selectIsCreateModalOpen,
  selectIsEditModalOpen,
  selectIsDetailModalOpen,
  selectIsConfirmDeleteOpen,
  selectPriceUiFilters,
  selectApiFilters,
  selectActiveFilterCount,
} from '@prices/selectors';
import {
  openCreateModal,
  openEditModal,
  openDetailModal,
  closeModal,
  closeConfirmDelete,
  openConfirmDelete,
  setUiFilters,
  resetUiFilters,
} from '@prices/slice/pricesSlice';
import { useGetParkingLotByIdQuery } from '@parking/api/parkingApi';
import type { PriceDisplayData, ParkingPriceResponse } from '@prices/types';
import { enhancePriceForDisplay } from '@prices/utils/priceUtils';
import { useMemo } from 'react';

interface Props {
  parkingLotId: number;
  canEdit?: boolean;
  canDelete?: boolean;
  onPriceCreated?: (price: PriceDisplayData) => void;
  onPriceUpdated?: (price: PriceDisplayData) => void;
  onPriceDeleted?: (priceId: number) => void;
}

export function PricesManagement({
                                   parkingLotId,
                                   canEdit = true,
                                   canDelete = true,
                                   onPriceCreated,
                                   onPriceUpdated,
                                   onPriceDeleted,
                                 }: Props) {
  const dispatch = useDispatch();

  const {
    data: lotResponse,
  } = useGetParkingLotByIdQuery(parkingLotId, {
    skip: !parkingLotId,
  });

  const lotData = lotResponse?.data;

  // Redux state
  const selectedPrice = useSelector(selectSelectedPrice);
  const modalState = useSelector(selectPriceModalState);
  const confirmDeleteState = useSelector(selectPriceConfirmDeleteState);
  const isCreateModalOpen = useSelector(selectIsCreateModalOpen);
  const isEditModalOpen = useSelector(selectIsEditModalOpen);
  const isDetailModalOpen = useSelector(selectIsDetailModalOpen);
  const isConfirmDeleteOpen = useSelector(selectIsConfirmDeleteOpen);
  const uiFilters = useSelector(selectPriceUiFilters);
  const apiFilters = useSelector(selectApiFilters);
  const activeFilterCount = useSelector(selectActiveFilterCount);

  // Filter handlers
  const updateFilters = (newFilters: any) => {
    dispatch(setUiFilters(newFilters));
  };

  const resetFilters = () => {
    dispatch(resetUiFilters());
  };

  const {
    prices,
    activePrices,
    expiredPrices,
    upcomingPrices,
    statistics,
    isLoading,
    isError,
    refetch,
    isEmpty,
  } = usePricesData({
    parkingLotId,
    filters: apiFilters,
    enabled: !!parkingLotId,
  });

  const isAnyPrice = activePrices.length > 0 || upcomingPrices.length > 0 || expiredPrices.length > 0;
  const isAllEmpty = prices.length === 0;

  const displayPrices = useMemo(() => {
    if (!prices) return [];

    const sortDirection = apiFilters?.sort ?? uiFilters?.sort ?? 'asc';
    const sorted = [...prices];

    sorted.sort((a, b) => {
      const pa = Number(a.price ?? 0);
      const pb = Number(b.price ?? 0);
      return sortDirection === 'asc' ? pa - pb : pb - pa;
    });

    return sorted;
  }, [prices, apiFilters?.sort, uiFilters?.sort])

  const {
    createPrice,
    updatePrice,
    deletePrice,
    loadingStates,
  } = usePriceMutations({
    parkingLotId,
    existingPrices: prices.map(p => ({
      id: p.id,
      vehicleType: p.vehicleType,
      price: p.price,
      validFrom: p.validFrom,
      validTo: p.validTo,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    })),
    onSuccess: (action, data) => {
      if (action === 'create' && data) {
        const enhanced = enhancePriceForDisplay(data);
        onPriceCreated?.(enhanced);
        dispatch(closeModal('create'));
      } else if (action === 'update' && data) {
        const enhanced = enhancePriceForDisplay(data);
        onPriceUpdated?.(enhanced);
        dispatch(closeModal('edit'));
      } else if (action === 'delete') {
        onPriceDeleted?.(confirmDeleteState?.id || 0);
        dispatch(closeConfirmDelete());
      }
    },
  });

  // Handle create price
  const handleCreatePrice = async (formData: any) => {
    await createPrice(formData);
  };

  // Handle update price
  const handleUpdatePrice = async (formData: any) => {
    if (selectedPrice) {
      await updatePrice(selectedPrice.id, formData);
    }
  };

  // Handle delete price
  const handleDeletePrice = async () => {
    if (confirmDeleteState) {
      await deletePrice(confirmDeleteState.id);
    }
  };

  // Handle price actions
  const handlePriceView = (price: PriceDisplayData) => {
    dispatch(openDetailModal(price as ParkingPriceResponse));
  };

  const handlePriceEdit = (price: PriceDisplayData) => {
    if (canEdit) {
      dispatch(openEditModal(price as ParkingPriceResponse));
    }
  };

  const handlePriceDelete = (price: PriceDisplayData) => {
    if (canDelete) {
      dispatch(openConfirmDelete(price as ParkingPriceResponse));
    }
  };

  // Handle edit from detail modal
  const handleEditFromDetail = (price: PriceDisplayData) => {
    dispatch(closeModal('detail'));
    dispatch(openEditModal(price as ParkingPriceResponse));
  };

  // Handle delete from detail modal
  const handleDeleteFromDetail = (price: PriceDisplayData) => {
    dispatch(closeModal('detail'));
    dispatch(openConfirmDelete(price as ParkingPriceResponse));
  };

  // Auto-refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 60000); // Refresh every minute to update active/expired status

    return () => clearInterval(interval);
  }, [refetch]);

  const sortedUpcomingPrices = upcomingPrices.slice().sort(
      (a, b) => new Date(a.validFrom).getTime() - new Date(b.validFrom).getTime()
  );

  return (
      <div className="space-y-6">
        {/* Header */}
        {lotData && (
            <PricesHeader
                lotName={lotData.name}
                lotAddress={lotData.address}
            />
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Prices Management
            </h2>
          </div>
          {canEdit && (
              <button
                  onClick={() => dispatch(openCreateModal())}
                  className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  disabled={loadingStates.isAnyLoading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Price</span>
              </button>
          )}
        </div>

        {/* Statistics */}
        {!isAllEmpty && !isLoading && (
            <PricesStats
                totalCount={statistics.activeRulesCount + statistics.expiredRulesCount + statistics.upcomingRulesCount}
                activeCount={statistics.activeRulesCount}
                upcomingCount={statistics.upcomingRulesCount}
                minPrice={statistics.minPrice}
                maxPrice={statistics.maxPrice}
            />
        )}

        {/* Filters */}
        <PriceFilters
            filters={uiFilters}
            onFiltersChange={updateFilters}
            onReset={resetFilters}
            activeCount={activeFilterCount}
            isLoading={isLoading}
        />

        {/* Error State */}
        {isError && (
            <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                  Failed to Load Price Data
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Unable to fetch pricing rules. Please check your connection and try again.
                </p>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
        )}

        {/* Prices Grid Sections (Active, Upcoming, etc.) */}
        {isAllEmpty && !isLoading && !isError && (
            <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
              <PricesGrid
                  prices={displayPrices}
                  isLoading={false}
                  isEmpty={true}
                  emptyMessage="No price rules found"
                  emptyDescription={
                    activeFilterCount > 0
                        ? "No price rules match your current filters. Try adjusting your search criteria."
                        : "Create your first price rule to start managing parking costs for different vehicle types."
                  }
              />
            </div>
        )}

        {/* Secciones de Precios */}
        {!isLoading && !isError && isAnyPrice && (
            <div className="space-y-8">

              {/* 1. Active Prices Section (4 columns) */}
              {activePrices.length > 0 && (
                  <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                      Active Price Rules
                    </h3>
                    <PricesGrid
                        prices={activePrices}
                        isLoading={isLoading}
                        isEmpty={activePrices.length === 0}
                        onPriceView={handlePriceView}
                        onPriceEdit={handlePriceEdit}
                        onPriceDelete={handlePriceDelete}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        layoutMode="active" // Aplica el layout de 4 columnas
                    />
                  </div>
              )}

              {/* 2. Upcoming Prices Section (Ordered by Valid From Date) */}
              {sortedUpcomingPrices.length > 0 && (
                  <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                      Upcoming Price Rules
                    </h3>
                    <PricesGrid
                        prices={sortedUpcomingPrices}
                        isLoading={isLoading}
                        isEmpty={sortedUpcomingPrices.length === 0}
                        onPriceView={handlePriceView}
                        onPriceEdit={handlePriceEdit}
                        onPriceDelete={handlePriceDelete}
                        canEdit={canEdit}
                        canDelete={canDelete}
                    />
                  </div>
              )}
            </div>
        )}

        {/* Modals */}
        <PriceFormModal
            isOpen={isCreateModalOpen}
            onClose={() => dispatch(closeModal('create'))}
            onSubmit={handleCreatePrice}
            isLoading={loadingStates.createPrice}
            mode="create"
            title="Create New Price Rule"
        />

        <PriceFormModal
            isOpen={isEditModalOpen}
            onClose={() => dispatch(closeModal('edit'))}
            onSubmit={handleUpdatePrice}
            isLoading={loadingStates.updatePrice}
            mode="edit"
            initialData={selectedPrice || undefined}
            title="Edit Price Rule"
        />

        <PriceDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => dispatch(closeModal('detail'))}
            price={selectedPrice ? enhancePriceForDisplay(selectedPrice) : null}
            onEdit={handleEditFromDetail}
            onDelete={handleDeleteFromDetail}
            canEdit={canEdit}
            canDelete={canDelete}
        />

        <ConfirmDeleteModal
            isOpen={isConfirmDeleteOpen}
            onClose={() => dispatch(closeConfirmDelete())}
            onConfirm={handleDeletePrice}
            isLoading={loadingStates.deletePrice}
            title="Delete Price Rule"
            message={
              confirmDeleteState
                  ? `Are you sure you want to delete the price rule for ${confirmDeleteState.priceInfo.vehicleType} at $${confirmDeleteState.priceInfo.price}? This action cannot be undone.`
                  : ''
            }
            confirmText="Delete Price Rule"
        />
      </div>
  );
}