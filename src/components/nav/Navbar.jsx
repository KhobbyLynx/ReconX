import React from 'react'
import {
  LiaFileAltSolid,
  LiaSlackHash,
  LiaListUlSolid,
  LiaYinYangSolid,
} from 'react-icons/lia'
import { NavLink } from 'react-router-dom'
import './Navbar.scss'

const activeStyles = {
  backgroundColor: '#fff',
  fontWeight: '600',
}

const icons = {
  dashboard: <LiaSlackHash className='icon' />,
  'bank accounts': <LiaListUlSolid className='icon' />,
  reconcile: <LiaYinYangSolid className='icon' />,
  reports: <LiaFileAltSolid className='icon' />,
}
const Navbar = ({ toggle }) => {
  return (
    <div className='navbar'>
      <div className='logo-container'>
        <img src='/vite.svg' className='logo-container__logo' />
      </div>
      <nav>
        <ul>
          {['dashboard', 'bank accounts', 'reconcile', 'reports'].map(
            (link) => (
              <li key={link}>
                <NavLink
                  to={
                    link === 'dashboard'
                      ? '.'
                      : link === 'bank accounts'
                      ? 'accounts'
                      : link
                  }
                  className='link'
                  style={({ isActive }) => (isActive ? activeStyles : null)}
                >
                  {icons[link]}
                  {toggle && <span>{link}</span>}
                </NavLink>
              </li>
            )
          )}
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
