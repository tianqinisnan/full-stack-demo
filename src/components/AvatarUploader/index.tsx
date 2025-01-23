import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styles from './style.module.css';
import Toast from '../Toast';
import { apiService } from '@src/services/api';
import { getFullUrl } from '@src/utils/url';

interface AvatarUploaderProps {
  defaultAvatar?: string;
  onAvatarChange?: (url: string) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ defaultAvatar, onAvatarChange }) => {
  const [preview, setPreview] = useState<string>(defaultAvatar ? getFullUrl(defaultAvatar) : '');
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });

  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
      }, 'image/jpeg');
    });
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const response = await apiService.uploadImage(file);
      return response.data?.url || '';
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('上传失败');
    }
  };

  const handleCropComplete = async () => {
    if (imageRef.current && crop.width && crop.height) {
      try {
        const croppedBlob = await getCroppedImg(
          imageRef.current,
          crop as PixelCrop
        );
        const croppedUrl = URL.createObjectURL(croppedBlob);
        setPreview(croppedUrl);
        
        // Convert blob to File
        const croppedFile = new File([croppedBlob], 'avatar.jpg', {
          type: 'image/jpeg'
        });
        
        // 上传图片并获取URL
        const uploadedUrl = await uploadImage(croppedFile);
        onAvatarChange?.(uploadedUrl);
        setShowCropModal(false);
      } catch (e) {
        console.error('Error cropping/uploading image:', e);
      }
    }
  };

  return (
    <>
      <div className={styles.container} onClick={() => document.getElementById('avatar-input')?.click()}>
        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className={styles.uploadInput}
        />
        {preview ? (
          <img src={preview} alt="Avatar" className={styles.preview} />
        ) : (
          <div className={styles.placeholder}>
            上传头像
          </div>
        )}
      </div>

      {showCropModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.cropContainer}>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="Crop"
                  className={styles.cropImage}
                />
              </ReactCrop>
            </div>
            <div className={styles.buttons}>
              <button
                className={`${styles.button} ${styles.cancelButton}`}
                onClick={() => setShowCropModal(false)}
              >
                取消
              </button>
              <button
                className={`${styles.button} ${styles.confirmButton}`}
                onClick={handleCropComplete}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AvatarUploader;