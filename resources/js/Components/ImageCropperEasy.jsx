import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import Slider from '@mui/material/Slider';

const ImageCropperEasy = ({
  initialImage = '',
  aspectRatio = 1.4/1.5,
  initialCrop = { x: 0, y: 0 },
  initialZoom = 1,
  onCropChange,
  onFileChange,
  buttonText = 'Cambiar imagen',
  showButton = true,
  className = '',
}) => {
  const [image, setImage] = useState(initialImage);
  const [crop, setCrop] = useState(initialCrop);
  const [zoom, setZoom] = useState(initialZoom);
  const [minZoom, setMinZoom] = useState(1);
  const inputRef = useRef();

  // Calcular minZoom dinámicamente
  const handleMediaLoaded = useCallback((mediaSize) => {
    const { naturalWidth, naturalHeight } = mediaSize;
    const containerAspect = aspectRatio;
    const imageAspect = naturalWidth / naturalHeight;
    let minZoomCalc = Math.max(1, 1 / Math.max(containerAspect / imageAspect, imageAspect / containerAspect));
    setMinZoom(minZoomCalc);
    setZoom(z => Math.max(minZoomCalc, initialZoom));
  }, [aspectRatio, initialZoom]);

  // Sincronizar crop y zoom con props
  useEffect(() => {
    setCrop(initialCrop);
    setZoom(z => Math.max(minZoom, initialZoom));
  }, [initialCrop, initialZoom, minZoom]);

  // Llamar a onCropChange cada vez que el usuario mueve o hace zoom
  const onCropChangeInternal = (c) => {
    setCrop(c);
    if (onCropChange) onCropChange(c, zoom);
  };
  const onZoomChangeInternal = (z) => {
    setZoom(z);
    if (onCropChange) onCropChange(crop, z);
  };

  // Cambiar imagen
  const handleClickImage = () => {
    if (inputRef.current) inputRef.current.click();
  };

  // Mostrar preview inmediato al subir imagen
  const handleFileChangeInternal = (e) => {
    if (onFileChange) onFileChange(e);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target.result);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setMinZoom(1);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="relative w-full" style={{ aspectRatio: aspectRatio, minHeight: 220, maxWidth: `calc(100% * ${aspectRatio})` }}>
            {image ? (
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                minZoom={minZoom}
                maxZoom={3}
                aspect={aspectRatio}
                onCropChange={onCropChangeInternal}
                onZoomChange={onZoomChangeInternal}
                cropShape="rect"
                showGrid={false}
                style={{ containerStyle: { width: '100%', height: '100%' } }}
                objectFit="cover"
                onMediaLoaded={handleMediaLoaded}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-gray-400 cursor-pointer"
                onClick={handleClickImage}
              >
                Click para subir imagen
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChangeInternal}
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-gray-500">Zoom</span>
            <Slider
              min={minZoom}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(_, value) => onZoomChangeInternal(value)}
              style={{ width: 120 }}
            />
          </div>
          {showButton && (
            <div className="flex justify-end mt-2 gap-2">
              <Button onClick={handleClickImage} variant="outlined">
                {buttonText}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCropperEasy; 