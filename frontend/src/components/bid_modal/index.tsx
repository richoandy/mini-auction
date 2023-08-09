// InputModal.tsx
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';

interface BidInputModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (inputValue: string) => void;
}

const BidInputModal: React.FC<BidInputModalProps> = ({ isOpen, onRequestClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Input Modal"
    >
      <h2>Enter Your Bid Price</h2>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <div className="d-inline-block m-2">
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
      <div className="d-inline-block m-2">
        <Button onClick={onRequestClose}>Cancel</Button>
      </div>
    </Modal>
  );
};

export default BidInputModal;
