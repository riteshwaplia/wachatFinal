import React from "react";
import Modal from "./Modal";
import Button from "./Button";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="p-4">
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <Button onClick={onClose} variant="secondary">
            {cancelText}
          </Button>
          <Button onClick={onConfirm} variant={confirmVariant}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;