import React from 'react'
import { LiaAlignCenterSolid } from 'react-icons/lia'

const TopBar = ({ setToggle }) => {
  return (
    <div className='topbar'>
      <div className='logo-container'>
        <img src='/vite.svg' className='logo-container__logo' />
      </div>
      <LiaAlignCenterSolid className='icon' onClick={setToggle} />
      <span className='styled-text'>Welcome! 🎉</span>
    </div>
  )
}

export default TopBar
