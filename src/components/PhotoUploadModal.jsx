import React, { useState, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Cropper from "react-easy-crop";
import { Button } from "./ui/button.jsx";
import { Label } from "./ui/label.jsx";
import { cn } from "@/lib/utils";
import { X, Upload, Trash2 } from "lucide-react";

/**
 * PhotoUploadModal - A modal component for uploading and cropping images
 * Features: drag-and-drop, drag-to-pan, zoom, circular crop
 */
const PhotoUploadModal = ({
  open,
  onOpenChange,
  onSave,
  initialImage = null,
  title = "Upload Profile Photo",
}) => {
  const [imageSrc, setImageSrc] = useState(initialImage);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  // Reset state when modal closes
  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setImageSrc(initialImage);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setError("");
    }
    onOpenChange(isOpen);
  };

  // Validate and load image file
  const handleFileLoad = (file) => {
    setError("");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, GIF, WEBP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.onerror = () => {
      setError("Failed to read image file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileLoad(file);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileLoad(file);
    }
  };

  // Callback when crop area changes
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Create cropped image
  const createCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return null;

    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size to desired output size (square)
        const size = 512; // Output size
        canvas.width = size;
        canvas.height = size;

        // Fill with white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);

        // Draw the cropped portion
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          size,
          size
        );

        // Apply circular mask
        ctx.globalCompositeOperation = "destination-in";
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "profile-photo.jpg", {
                type: "image/jpeg",
              });
              const url = URL.createObjectURL(blob);
              resolve({ file, url });
            } else {
              resolve(null);
            }
          },
          "image/jpeg",
          0.95
        );
      };
      image.src = imageSrc;
    });
  };

  // Handle save
  const handleSave = async () => {
    if (!imageSrc) {
      setError("Please select an image first");
      return;
    }

    try {
      const croppedImage = await createCroppedImage();
      if (croppedImage) {
        onSave(croppedImage.file, croppedImage.url);
        handleOpenChange(false);
      } else {
        setError("Failed to process image. Please try again.");
      }
    } catch (err) {
      console.error("Error cropping image:", err);
      setError("Failed to process image. Please try again.");
    }
  };

  // Handle remove photo
  const handleRemove = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          {/* Upload Area or Cropper */}
          <div className="space-y-4">
            {!imageSrc ? (
              // Upload Zone
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-primary hover:bg-gray-50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Drag and drop your photo here
                    </p>
                    <p className="text-xs text-gray-500">
                      or click the button below to browse
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("photo-upload-input")?.click()
                    }
                  >
                    Choose Photo
                  </Button>
                  <p className="text-xs text-gray-400">
                    Supported formats: JPG, PNG, GIF, WEBP (max 5MB)
                  </p>
                </div>
              </div>
            ) : (
              // Cropper Area
              <div className="space-y-4">
                <div
                  className="relative w-full bg-gray-100 rounded-lg overflow-hidden"
                  style={{ height: "400px" }}
                >
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>

                {/* Zoom Control */}
                <div className="space-y-2">
                  <Label htmlFor="zoom-slider" className="text-sm font-medium">
                    Zoom: {zoom.toFixed(2)}x
                  </Label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">1x</span>
                    <input
                      id="zoom-slider"
                      type="range"
                      min="1"
                      max="3"
                      step="0.01"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="text-xs text-gray-500">3x</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Drag the image to reposition, use the slider to zoom
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
            <div>
              {imageSrc && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleRemove}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Photo
                </Button>
              )}
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSave} disabled={!imageSrc}>
                Save Photo
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PhotoUploadModal;
