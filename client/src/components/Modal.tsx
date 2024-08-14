import React from 'react';

interface ModalProps {
  isOpen: boolean;
  closeModal: (event: React.MouseEvent<HTMLDivElement>) => void;
  modalContent: React.ReactNode;
  modalRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, modalContent, modalRef, className }) => {
  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      onClick={(e) => closeModal(e)}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop:blur-sm flex justify-end items-end md:justify-center md:items-center"
    >
      <div
        className={`xl:min-h-3/6 xl:min-w-5/12 lg:min-w-6/12 md:min-h-3/6 md:min-w-8/12 min-h-4/6 min-w-screen bg-zinc-100 dark:bg-zinc-800 rounded-xl ${className}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {modalContent}
      </div>
    </div>
  );
};

export default Modal;
