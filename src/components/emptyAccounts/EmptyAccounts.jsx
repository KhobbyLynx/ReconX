import React from 'react'
import { RxShadowNone } from 'react-icons/rx'
import './EmptyAccounts.scss'
import { Link } from 'react-router-dom'

const EmptyAccounts = () => {
  return (
    <div className='no-accounts'>
      <div className='no-accounts__icon-container'>
        <RxShadowNone className='no-accounts__icon' size={64} />
      </div>
      <h6 className='no-accounts__title'>No Accounts</h6>
    </div>
  )
}

export default EmptyAccounts
