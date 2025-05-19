import React, { useRef, useEffect } from "react";

// Utilidad para calcular el área recortada exacta (basado en react-easy-crop)
function getCroppedImgArea(imageWidth, imageHeight, crop, zoom, aspect) {
  // crop.x y crop.y en porcentaje (-100 a 100)
  // zoom >= 1
  // aspect = width / height

  // Tamaño del área visible en la imagen original
  const croppedAreaWidth = imageWidth / zoom;
  const croppedAreaHeight = croppedAreaWidth / aspect;

  // Centro del crop en la imagen original
  const centerX = imageWidth / 2 + (crop?.x ?? 0) * imageWidth / 200;
  const centerY = imageHeight / 2 + (crop?.y ?? 0) * imageHeight / 200;

  // Esquina superior izquierda del área recortada
  const x = centerX - croppedAreaWidth / 2;
  const y = centerY - croppedAreaHeight / 2;

  return {
    x: Math.max(0, x),
    y: Math.max(0, y),
    width: Math.min(croppedAreaWidth, imageWidth - x),
    height: Math.min(croppedAreaHeight, imageHeight - y),
  };
}

export default function CroppedImageCanvas({ image, crop, zoom, aspectRatio, className = "" }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!image || !canvasRef.current || !containerRef.current) return;
    const img = new window.Image();
    img.src = image;
    img.onload = () => {
      const container = containerRef.current;
      const width = container.offsetWidth;
      const height = width / aspectRatio;

      // Ajusta el tamaño real del canvas
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      // Calcula el área recortada exacta
      const cropArea = getCroppedImgArea(imgWidth, imgHeight, crop, zoom, aspectRatio);

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(
        img,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        0, 0, width, height
      );
    };
  }, [image, crop, zoom, aspectRatio]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden w-full h-full ${className}`}
      style={{ aspectRatio, position: "relative" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover",
        }}
      />
    </div>
  );
}
