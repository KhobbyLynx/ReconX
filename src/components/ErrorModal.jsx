import React from 'react'
import Modal from './portal/Modal'

const ErrorModal = ({ open, onClose, errorMsg }) => {
  if (!errorMsg) return
  return (
    <Modal open={open} onClose={onClose} className='modal'>
      <p>{errorMsg}</p>
    </Modal>
  )
}

export default ErrorModal
