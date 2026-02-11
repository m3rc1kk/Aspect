import { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import './AvatarUpload.scss';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const FORBIDDEN_EXTENSIONS = ['.psd', '.psb', '.ai', '.eps', '.tiff', '.tif', '.bmp', '.ico', '.heic', '.heif'];
const MAX_FILE_SIZE_MB = 5;

function getFileExtension(name) {
    const i = name.lastIndexOf('.');
    return i === -1 ? '' : name.slice(i).toLowerCase();
}

function isAllowedFile(file) {
    const ext = getFileExtension(file.name);
    if (FORBIDDEN_EXTENSIONS.includes(ext)) {
        return { ok: false, error: 'Этот формат не поддерживается. Загрузите JPEG, PNG, GIF или WebP.' };
    }
    const type = (file.type || '').toLowerCase();
    const allowed = ALLOWED_IMAGE_TYPES.some((t) => type === t);
    if (!allowed) {
        return { ok: false, error: 'Неверный формат файла. Разрешены только изображения: JPEG, PNG, GIF, WebP.' };
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return { ok: false, error: `Файл слишком большой. Максимум ${MAX_FILE_SIZE_MB} МБ.` };
    }
    return { ok: true };
}

export default function AvatarUpload({ onImageChange }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [fileError, setFileError] = useState(null);
    const fileInputRef = useRef(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileError(null);
        const check = isAllowedFile(file);
        if (!check.ok) {
            setFileError(check.error);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImageSrc(reader.result);
            setShowCropper(true);
        });
        reader.readAsDataURL(file);
    };

    const handleConfirm = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        setImageSrc(croppedImage);
        setShowCropper(false);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        if (onImageChange) {
            onImageChange(croppedImage);
        }
    };

    const handleCancel = () => {
        setShowCropper(false);
        setImageSrc(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setFileError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleEdit = () => {
        setShowCropper(true);
    };

    const handleRemove = () => {
        setImageSrc(null);
        setShowCropper(false);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setFileError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (onImageChange) {
            onImageChange(null);
        }
    };

    return (
        <div className="avatar-upload">
            <label className="avatar-upload__label">Avatar</label>
            
            <div className="avatar-upload__container">
                <div className="avatar-upload__preview">
                    {imageSrc && !showCropper ? (
                        <img 
                            src={imageSrc} 
                            alt="Avatar preview" 
                            className="avatar-upload__image"
                        />
                    ) : !showCropper ? (
                        <div className="avatar-upload__placeholder">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="8" r="4"/>
                                <path d="M4 20c0-4 3-7 8-7s8 3 8 7"/>
                            </svg>
                        </div>
                    ) : null}
                </div>

                {!showCropper && (
                    <div className="avatar-upload__actions">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
                            onChange={handleFileChange}
                            className="avatar-upload__input"
                            id="avatar-upload-input"
                        />
                        <label 
                            htmlFor="avatar-upload-input" 
                            className="avatar-upload__button"
                        >
                            {imageSrc ? 'Change' : 'Upload'}
                        </label>
                        {fileError && (
                            <p className="avatar-upload__error" role="alert">
                                {fileError}
                            </p>
                        )}
                        {imageSrc && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    className="avatar-upload__button avatar-upload__button--secondary"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="avatar-upload__button avatar-upload__button--danger"
                                >
                                    Remove
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {showCropper && imageSrc && (
                <div className="avatar-upload__cropper-overlay">
                    <div className="avatar-upload__cropper-modal">
                        <div className="avatar-upload__cropper-header">
                            <h3 className="avatar-upload__cropper-title">Adjust Your Avatar</h3>
                        </div>
                        
                        <div className="avatar-upload__cropper-container">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>

                        <div className="avatar-upload__cropper-controls">
                            <label className="avatar-upload__cropper-label">
                                <span>Zoom</span>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="avatar-upload__cropper-slider"
                                />
                            </label>
                        </div>

                        <div className="avatar-upload__cropper-actions">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="avatar-upload__cropper-button avatar-upload__cropper-button--cancel"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="avatar-upload__cropper-button avatar-upload__cropper-button--confirm"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

async function getCroppedImg(imageSrc, pixelCrop) {
    const image = new Image();
    image.src = imageSrc;
    
    return new Promise((resolve) => {
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;

            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );

            resolve(canvas.toDataURL('image/jpeg', 0.95));
        };
    });
}
