import React from 'react'
import ReactDOM from 'react-dom'
import { AiOutlineClose } from 'react-icons/ai'
import './Modal.scss'

const Modal = ({ children, open, onClose }) => {
  if (!open) return null
  return ReactDOM.createPortal(
    <>
      <div className='overlay' />
      <div className='modal'>
        <div className='close-icon-container'>
          <AiOutlineClose onClick={onClose} className='nav-link-icon' />
        </div>
        {children}
      </div>
    </>,
    document.getElementById('portal')
  )
}

export default Modal
