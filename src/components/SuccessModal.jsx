import React from 'react'
import Modal from './portal/Modal'

const SuccessModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} className='modal'>
      <p>Successful</p>
    </Modal>
  )
}

export default SuccessModal
