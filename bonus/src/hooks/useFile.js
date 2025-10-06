import { useState, useRef } from 'react';

export const useFile = () => {
  const [fileB64, setFileB64] = useState('');
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (file) => {
    setStatus('');
    if (!file) return;
    if (file.size > 100 * 1024) {
      setStatus(`File too large (${Math.round(file.size / 1024)} KB). Consider resizing or using IPFS.`);
      return;
    }
    try {
      const b64 = await fileToBase64(file);
      setFileB64(b64);
      setPreview(URL.createObjectURL(file));
    } catch (err) {
      setStatus('Failed to read file: ' + err.message);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    } else {
      setStatus('Please drop an image file.');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return {
    fileB64,
    preview,
    status,
    isDragOver,
    fileInputRef,
    handleFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    openFileDialog
  };
};
