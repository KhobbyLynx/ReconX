import React from 'react'
import Modal from './portal/Modal'
import { LiaCheckCircleSolid } from 'react-icons/lia'

const SuccessModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} className='modal'>
      <div className='modal__icon'>
        <LiaCheckCircleSolid size={90} />
      </div>
      <p>DONE</p>
    </Modal>
  )
}

export default SuccessModal
