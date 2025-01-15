import React, { useState, useRef } from 'react';
import { profileService } from '../../services/supabaseService';
import { toast } from 'react-hot-toast';

interface ProfileImageUploadProps {
  userId: string;
  currentImage: string | null;
  onImageUpdate: (imageUrl: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  userId,
  currentImage,
  onImageUpdate
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await profileService.uploadProfileImage(userId, file);
      if (imageUrl) {
        onImageUpdate(imageUrl);
        toast.success('Profile image updated successfully');
      }
    } catch (err: any) {
      console.error('Error uploading image:', err);
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!currentImage) return;

    try {
      setUploading(true);
      await profileService.removeProfileImage(userId);
      onImageUpdate('');
      toast.success('Profile image removed successfully');
    } catch (err: any) {
      console.error('Error removing image:', err);
      toast.error(err.message || 'Failed to remove image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group"
        onClick={handleImageClick}
      >
        {currentImage ? (
          <>
            <img
              src={currentImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm">Change Photo</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-4xl">+</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {uploading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Uploading...</p>
        </div>
      )}

      {currentImage && !uploading && (
        <button
          onClick={handleRemoveImage}
          className="text-sm text-red-500 hover:text-red-600"
        >
          Remove Photo
        </button>
      )}
    </div>
  );
};

export default ProfileImageUpload; 