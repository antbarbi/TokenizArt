import React from 'react';

const ImageUploader = ({ fileInputRef, isDragOver, handleDragOver, handleDragLeave, handleDrop, openFileDialog, preview, fileB64, status, handleFile }) => {
  return (
    <div className="max-w-md mx-auto">
      <input type="file" accept="image/*" onChange={handleFile} ref={fileInputRef} style={{ display: 'none' }} />

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-2 text-sm">Drag and drop an image here, or click to select</p>
          <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10KB</p>
        </div>
      </div>
      {preview && (
        <>
          <div className="flex justify-center mt-4">
            <img src={preview} alt="preview" className="max-w-60 max-h-60 border rounded" />
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">Base64 length: {fileB64.length} chars</div>
        </>
      )}
      {status && <div style={{ marginTop: 12, color: 'darkred' }}>{status}</div>}
    </div>
  );
};

export default ImageUploader;
