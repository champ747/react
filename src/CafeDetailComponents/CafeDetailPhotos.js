import React, { useState } from 'react';
import './CafeDetailPhotos.css';

const CafeDetailPhotos = ({ photos }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const openModal = (photo) => {
    setSelectedPhoto(photo);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setModalOpen(false);
  };

  return (
    <div className="photos-container">
      {photos.map((photo, index) => (
        <div key={index} className="photo-item">
          <img
            src={photo}
            alt={`사진 ${index + 1}`}
            className="photo-image"
            onClick={() => openModal(photo)} // 사진 클릭 시 모달 열기
          />
        </div>
      ))}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <img src={selectedPhoto} alt="확대된 사진" className="modal-photo" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CafeDetailPhotos;