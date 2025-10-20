import { useState } from 'react';
import type { CreateParkingLotRequest } from '@parking/types';
import { AddressPicker } from '@shared/components/AddressPicker';
import { ImagePreview } from '@shared/components/ImagePreview';
import { Input } from '@shared/ui/components';
import { useTypedTranslation } from '@shared/hooks/useTypedTranslation';
import { Modal } from '@shared/ui/components';

interface CreateParkingLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateParkingLotRequest) => void;
  isLoading: boolean;
}

export function CreateParkingLotModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateParkingLotModalProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [latitude, setLatitude] = useState<number>(100);
  const [longitude, setLongitude] = useState<number>(100);
  const { t } = useTypedTranslation();

  const handleSubmit = () => {
    if (!name.trim() || !address.trim()) return;

    onSubmit({
      name,
      address,
      imageUrl,
      latitude,
      longitude
    });

    setName('');
    setAddress('');
    setImageUrl(undefined);
    setLatitude(100);
    setLongitude(100);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="card-elevated w-full animate-slide-in">
        <div className="card-body space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {t('parking.lots.modals.create.title')}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {t('parking.lots.modals.create.description')}
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label={t('parking.lots.modals.create.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('parking.lots.modals.create.namePlaceholder')}
              disabled={isLoading}
            />
            <AddressPicker
              address={address}
              setAddress={setAddress}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              disabled={isLoading}
            />
            <div className="space-y-2">
              <Input
                label={t('parking.lots.modals.create.imageUrl')}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder={t('parking.lots.modals.create.imageUrlPlaceholder')}
                disabled={isLoading}
              />
              {/* Image Preview */}
              {imageUrl && (
                <ImagePreview
                  src={imageUrl}
                  alt={t('parking.lots.modals.create.imagePreviewAlt')}
                  size="md"
                />
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
              disabled={isLoading || !name || !address}
            >
              {isLoading ? t('parking.welcome.creating') : t('parking.lots.modals.create.createButton')}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
