import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  useGetParkingLotByIdQuery, 
  useGetSpotsByParkingLotIdQuery,
  useCreateSpotMutation,
  useUpdateSpotMutation,
  useDeleteSpotMutation,
  useUpdateParkingLotMutation,
  useDeleteParkingLotMutation
} from '../api/parkingApi';
import { config } from '../../../shared/config/env';
import { ParkingSpotsGrid } from '../components/ParkingSpotsGrid';
import { SpotFilters } from '../components/SpotFilters';
import { SpotDetailModal } from '../components/SpotDetailModal';
import { CreateSpotModal } from '../components/CreateSpotModal';
import { EditSpotModal } from '../components/EditSpotModal';
import { ParkingLotSettingsModal } from '../components/ParkingLotSettingsModal';
import { ConfirmDeleteModal } from '../../../shared/ui/components';
import type { 
  SpotDTO, 
  SpotFilters as SpotFiltersType, 
  CreateSpotRequest, 
  UpdateSpotRequest,
  UpdateParkingLotRequest
} from '../types';
import { logger } from '@shared/utils';
import { useNotification } from '@shared/contexts/NotificationContext';

export function DashboardPage() {
  const params = useParams();
  const lotId = params.lotId ? Number(params.lotId) : NaN;
  const [spotFilters, setSpotFilters] = useState<SpotFiltersType>({});
  const [selectedSpot, setSelectedSpot] = useState<SpotDTO | null>(null);
  const [showSpotModal, setShowSpotModal] = useState(false);
  const [showCreateSpotForm, setShowCreateSpotForm] = useState(false);
  const [showEditSpotForm, setShowEditSpotForm] = useState(false);
  const [showParkingLotSettings, setShowParkingLotSettings] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'spot' | 'lot'; id: number } | null>(null);
  const { showNotification } = useNotification();

  const { data, isLoading, isError, refetch } = useGetParkingLotByIdQuery(lotId, {
    pollingInterval: config.polling.dashboardInterval,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    skip: isNaN(lotId),
  });

  const { 
    data: spotsData, 
    isLoading: spotsLoading, 
    isError: spotsError,
    refetch: refetchSpots
  } = useGetSpotsByParkingLotIdQuery(
    { parkingLotId: lotId, ...spotFilters }, 
    {
      pollingInterval: config.polling.dashboardInterval,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      skip: isNaN(lotId),
    }
  );

  // Get ALL spots for filter options (without any filters applied)
  const { 
    data: allSpotsData, 
    refetch: refetchAllSpots
  } = useGetSpotsByParkingLotIdQuery(
    { parkingLotId: lotId }, 
    {
      pollingInterval: config.polling.dashboardInterval,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      skip: isNaN(lotId),
    }
  );

  // Log both query results
  logger.debug('Parking Lot Data:', data);
  logger.debug('Spots Data:', spotsData);

  // Mutations
  const [createSpot, { isLoading: isCreatingSpot }] = useCreateSpotMutation();
  const [updateSpot, { isLoading: isUpdatingSpot }] = useUpdateSpotMutation();
  const [deleteSpot, { isLoading: isDeletingSpot }] = useDeleteSpotMutation();
  const [updateParkingLot, { isLoading: isUpdatingLot }] = useUpdateParkingLotMutation();
  const [deleteParkingLot, { isLoading: isDeletingLot }] = useDeleteParkingLotMutation();

  const spots = Array.isArray(spotsData?.data?.content) ? spotsData.data.content : [];
  const allSpots = Array.isArray(allSpotsData?.data?.content) ? allSpotsData.data.content : [];
  
  const metrics = {
    capacity: allSpots.length, 
    available: spots.filter(s => s?.isAvailable).length,
    inUse: spots.filter(s => !s?.isAvailable).length,
    occupancy: allSpots.length > 0 ? Math.round((allSpots.filter(s => !s?.isAvailable).length / allSpots.length) * 100) : 0
  };

  const availableFilters = {
    floors: Array.from(new Set(allSpots.filter(s => s?.floor !== undefined).map(s => s.floor))).sort((a, b) => a - b),
    vehicleTypes: Array.from(new Set(allSpots.filter(s => s?.vehicleType).map(s => s.vehicleType.toLowerCase())))
  };

  const handleSpotClick = (spot: SpotDTO) => {
    setSelectedSpot(spot);
    setShowSpotModal(true);
  };

  const handleCloseSpotModal = () => {
    setShowSpotModal(false);
    setSelectedSpot(null);
  };

  const handleFiltersChange = (filters: SpotFiltersType) => {
    setSpotFilters(filters);
  };

  const handleCreateSpot = async (spotData: CreateSpotRequest) => {
    try {
      await createSpot(spotData).unwrap();
      setShowCreateSpotForm(false);
      showNotification('success', 'Spot created successfully!');
      refetchSpots();
      refetchAllSpots();
    } catch (error: any) {
      console.error('Failed to create spot:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to create spot';
      showNotification('error', errorMessage, 5000);
    }
  };

  const handleUpdateSpot = async (id: number, spotData: UpdateSpotRequest) => {
    try {
      await updateSpot({ id, body: spotData }).unwrap();
      setShowEditSpotForm(false);
      setSelectedSpot(null);
      showNotification('success', 'Spot updated successfully!');
      refetchSpots();
      refetchAllSpots();
    } catch (error: any) {
      console.error('Failed to update spot:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to update spot';
      showNotification('error', errorMessage, 5000);
    }
  };

  const handleDeleteSpot = async (id: number) => {
    try {
      await deleteSpot(id).unwrap();
      setConfirmDelete(null);
      setSelectedSpot(null);
      setShowSpotModal(false);
      showNotification('success', 'Spot deleted successfully!');
      refetchSpots();
      refetchAllSpots();
    } catch (error: any) {
      console.error('Failed to delete spot:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to delete spot';
      showNotification('error', errorMessage, 5000);
    }
  };

  const handleUpdateParkingLot = async (lotData: UpdateParkingLotRequest) => {
    try {
      await updateParkingLot({ id: lotId, body: lotData }).unwrap();
      setShowParkingLotSettings(false);
      showNotification('success', 'Parking lot updated successfully!');
      refetch();
    } catch (error: any) {
      console.error('Failed to update parking lot:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to update parking lot';
      showNotification('error', errorMessage, 5000);
    }
  };

  const handleDeleteParkingLot = async () => {
    try {
      await deleteParkingLot(lotId).unwrap();
      setConfirmDelete(null);
      showNotification('success', 'Parking lot deleted successfully!');
    } catch (error: any) {
      console.error('Failed to delete parking lot:', error);
      const errorMessage = error?.data?.message || error?.message || 'Failed to delete parking lot';
      showNotification('error', errorMessage, 5000);
    }
  };

  if (isNaN(lotId)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Select a Parking Lot
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Choose a parking lot from the sidebar to view its dashboard and manage spots.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="p-6 border border-error-200 bg-error-50 dark:bg-error-900/20 dark:border-error-800 rounded-lg text-center max-w-md">
          <svg className="w-12 h-12 text-error-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium text-error-700 dark:text-error-300 mb-2">
            Failed to Load Dashboard
          </h3>
          <p className="text-sm text-error-600 dark:text-error-400 mb-4">
            Unable to fetch parking lot data. Please check your connection and try again.
          </p>
          <button 
            className="px-4 py-2 text-sm bg-error-600 hover:bg-error-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2" 
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const lotName = data?.data?.name ?? `Lot ${lotId}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{lotName}</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Live data updates every {Math.round(config.polling.dashboardInterval / 1000)}s
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowParkingLotSettings(true)}
            className="px-3 py-2 text-sm bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.5 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </button>
          <button
            onClick={() => setConfirmDelete({ type: 'lot', id: lotId })}
            className="px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            disabled={isDeletingLot}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete Lot</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Capacity" 
          value={metrics.capacity}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="blue"
        />
        <KpiCard 
          title="Available Spots" 
          value={metrics.available}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="green"
        />
        <KpiCard 
          title="Spots in Use" 
          value={metrics.inUse}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
          color="orange"
        />
        <KpiCard 
          title="Occupancy Rate" 
          value={`${metrics.occupancy}%`}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="purple"
          progress={metrics.occupancy}
        />
      </div>

      {/* Spots section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Parking Spots
          </h2>
          <div className="flex items-center space-x-3">
            {spotsError && (
              <button
                onClick={() => refetchSpots()}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                Retry Loading Spots
              </button>
            )}
            <button
              onClick={() => setShowCreateSpotForm(true)}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
              disabled={isCreatingSpot}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Spot</span>
            </button>
          </div>
        </div>

        {/* Spot Filters */}
        <SpotFilters
          onFiltersChange={handleFiltersChange}
          availableFloors={availableFilters.floors}
          availableVehicleTypes={availableFilters.vehicleTypes}
          initialFilters={spotFilters}
        />

        {/* Spots Grid */}
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
          {spotsError ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-medium text-red-700 dark:text-red-300 mb-2">
                Failed to Load Spots
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                Unable to fetch parking spots data.
              </p>
            </div>
          ) : (
            <ParkingSpotsGrid
              spots={spots}
              isLoading={spotsLoading}
              onSpotClick={handleSpotClick}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <SpotDetailModal
        spot={selectedSpot}
        isOpen={showSpotModal}
        onClose={handleCloseSpotModal}
        onEdit={() => {
          setShowEditSpotForm(true);
          setShowSpotModal(false);
        }}
        onDelete={() => selectedSpot && setConfirmDelete({ type: 'spot', id: selectedSpot.id })}
      />
      
      <CreateSpotModal
        isOpen={showCreateSpotForm}
        onClose={() => setShowCreateSpotForm(false)}
        onSubmit={handleCreateSpot}
        parkingLotId={lotId}
        isLoading={isCreatingSpot}
      />
      
      <EditSpotModal
        isOpen={showEditSpotForm}
        onClose={() => setShowEditSpotForm(false)}
        onSubmit={handleUpdateSpot}
        spot={selectedSpot}
        isLoading={isUpdatingSpot}
      />
      
      <ParkingLotSettingsModal
        isOpen={showParkingLotSettings}
        onClose={() => setShowParkingLotSettings(false)}
        onSubmit={handleUpdateParkingLot}
        parkingLot={data?.data}
        isLoading={isUpdatingLot}
      />
      
      <ConfirmDeleteModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (confirmDelete?.type === 'spot') {
            handleDeleteSpot(confirmDelete.id);
          } else if (confirmDelete?.type === 'lot') {
            handleDeleteParkingLot();
          }
        }}
        title={confirmDelete?.type === 'spot' ? 'Delete Spot' : 'Delete Parking Lot'}
        message={confirmDelete?.type === 'spot' 
          ? 'Are you sure you want to delete this parking spot? This action cannot be undone.'
          : 'Are you sure you want to delete this parking lot? This will also delete all associated spots and cannot be undone.'
        }
        isLoading={isDeletingSpot || isDeletingLot}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}

interface KpiCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'purple';
  progress?: number;
}

function KpiCard({ title, value, icon, color = 'blue', progress }: KpiCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
    green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
  };

  return (
    <div className="p-6 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</p>
        <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                progress >= 80 ? 'bg-red-500' : 
                progress >= 60 ? 'bg-orange-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}


