// Settings feature types
export interface UserProfileFormData {
  firstName: string;
  lastName: string;
  imageUrl?: string;
  userDetail: {
    phone?: string;
    address?: string;
  };
}

export interface SettingsTab {
  id: 'profile' | 'parking-lots';
  label: string;
  icon: React.ReactNode;
}
