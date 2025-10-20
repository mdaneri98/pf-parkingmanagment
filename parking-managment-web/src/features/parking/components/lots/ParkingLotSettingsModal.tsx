import { useState, useEffect } from 'react';
import type { UpdateParkingLotRequest, ParkingLotResponse } from '@parking/types';
import { AddressPicker } from '@shared/components/AddressPicker';
import { ImagePreview } from '@shared/components/ImagePreview';
import { Input, Modal } from '@shared/ui/components';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lotData: UpdateParkingLotRequest) => void;
  parkingLot: ParkingLotResponse | null | undefined;
  isLoading: boolean;
}

export function ParkingLotSettingsModal({ isOpen, onClose, onSubmit, parkingLot, isLoading }: Props) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [latitude, setLatitude] = useState<number>(100);
  const [longitude, setLongitude] = useState<number>(100);
  const { t } = useTypedTranslation();

  // Update form data when parkingLot changes
  useEffect(() => {
    if (parkingLot) {
      setName(parkingLot.name || '');
      setAddress(parkingLot.address || '');
      setImageUrl(parkingLot.imageUrl || undefined);
      setLatitude(parkingLot.coordinates?.latitude || 100);
      setLongitude(parkingLot.coordinates?.longitude || 100);
    }
  }, [parkingLot]);

  const handleSubmit = () => {
    if (!name.trim() || !address.trim()) return;
    
    onSubmit({
      name,
      address,
      imageUrl,
      latitude,
      longitude
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="card-elevated w-full animate-slide-in">
        <div className="card-body space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {t('parking.lots.modals.settings.title')}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {t('parking.lots.modals.settings.description')}
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label={t('parking.lots.modals.settings.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('parking.lots.modals.settings.namePlaceholder')}
              disabled={isLoading}
            />

            <AddressPicker
              address={address}
              setAddress={setAddress}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              disabled={isLoading}
            />

            <div className="space-y-3">
              <Input
                label={t('parking.lots.modals.settings.imageUrl')}
                value={imageUrl || ''}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder={t('parking.lots.modals.settings.imageUrlPlaceholder')}
                disabled={isLoading}
              />
              
              {/* Image Preview */}
              {imageUrl && imageUrl.trim() && (
                <div className="flex justify-center">
                  <ImagePreview
                    src={imageUrl}
                    alt={name || t('parking.lots.modals.settings.imagePreviewAlt')}
                    size="sm"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary flex-1"
              disabled={isLoading || !name.trim() || !address.trim()}
            >
              {isLoading ? t('common.updating') : t('parking.lots.modals.settings.saveButton')}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}