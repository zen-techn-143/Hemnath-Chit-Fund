import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ClickButton } from './components/ClickButton';
const NetworkStatusPopup = ({ isOnline, retryConnection }) => {
  return (
    <Modal show={!isOnline} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Network Connection Lost</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        You are currently offline. Please check your network connection.
      </Modal.Body>
      <Modal.Footer>
        <ClickButton label={<>Retry</>} variant="primary" onClick={retryConnection}>
          
        </ClickButton>
      </Modal.Footer>
    </Modal>
  );
};

export default NetworkStatusPopup;
