import { useState, useRef } from "react";
import ButtonLink from "../Button/Button.jsx";
import fileIcon from "../../assets/images/PostComposer/file.svg";
import postSendIcon from "../../assets/images/PostComposer/post-send.svg";

const MAX_IMAGES = 10;
const MAX_DIMENSION = 1920;
const COMPRESS_QUALITY = 0.8;

function compressImage(file) {
    return new Promise((resolve) => {
        // Skip non-image or small files (< 500KB)
        if (!file.type.startsWith('image/') || file.size < 512000) {
            resolve(file);
            return;
        }

        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            let { width, height } = img;

            // Only resize if larger than max dimension
            if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
                // Still compress quality if file is large (> 2MB)
                if (file.size < 2 * 1024 * 1024) {
                    resolve(file);
                    return;
                }
            }

            if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const compressed = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(compressed);
                    } else {
                        resolve(file);
                    }
                },
                'image/jpeg',
                COMPRESS_QUALITY
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(file);
        };

        img.src = url;
    });
}

export default function PostComposer({ placeholder = "How's life?)", onSubmit }) {
    const [text, setText] = useState("");
    const [images, setImages] = useState([]);       // compressed files for upload
    const [previews, setPreviews] = useState([]);    // blob URLs for display
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const canAddMore = images.length < MAX_IMAGES;

    const handleSubmit = async (e) => {
        e?.preventDefault();
        
        if (!text.trim() && images.length === 0) return;
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            await onSubmit?.(text, images);
            setText("");
            previews.forEach(url => URL.revokeObjectURL(url));
            setImages([]);
            setPreviews([]);
        } catch (error) {
            console.error('Error submitting post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const rasterOnly = files.filter(f => ALLOWED_TYPES.includes(f.type));
        if (rasterOnly.length === 0) return;

        const slotsLeft = MAX_IMAGES - images.length;
        const filesToAdd = rasterOnly.slice(0, slotsLeft);

        if (filesToAdd.length > 0) {
            const compressed = await Promise.all(filesToAdd.map(compressImage));
            const newPreviews = compressed.map(f => URL.createObjectURL(f));

            setImages(prev => [...prev, ...compressed]);
            setPreviews(prev => [...prev, ...newPreviews]);
        }

        // Reset input so the same file can be selected again
        e.target.value = '';
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(previews[index]);
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="post-composer">
            <form className="post-composer__inner" onSubmit={handleSubmit}>
                <textarea
                    className="post-composer__textarea"
                    placeholder={placeholder}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    disabled={isSubmitting}
                />
                
                {images.length > 0 && (
                    <div className="post-composer__preview">
                        <div className="post-composer__images-scroll">
                            <div className="post-composer__images-preview">
                                {images.map((image, index) => (
                                    <div key={index} className="post-composer__image-item">
                                        <img 
                                            src={previews[index]}
                                            alt={`Preview ${index + 1}`}
                                            className="post-composer__image-preview"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="post-composer__image-remove"
                                            aria-label="Remove image"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <span className="post-composer__image-count">
                            {images.length}/{MAX_IMAGES}
                        </span>
                    </div>
                )}

                <div className="post-composer__actions">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/gif,image/webp"
                        multiple
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                    <ButtonLink
                        type="button"
                        className={`post-composer__attach ${!canAddMore ? 'post-composer__attach--disabled' : ''}`}
                        onClick={canAddMore ? handleAttachClick : undefined}
                        aria-label="Attach media"
                        disabled={isSubmitting || !canAddMore}
                    >
                        <img src={fileIcon} alt="" width={24} height={24} loading="lazy" />
                    </ButtonLink>
                    <ButtonLink
                        type="submit"
                        className="post-composer__send"
                        aria-label="Send post"
                        disabled={isSubmitting || (!text.trim() && images.length === 0)}
                    >
                        <img src={postSendIcon} alt="" width={24} height={24} loading="lazy" />
                    </ButtonLink>
                </div>
            </form>
        </div>
    );
}
