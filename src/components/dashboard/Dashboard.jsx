import React from 'react'
import { Link } from 'react-router-dom'
import {
  LiaPlusSquareSolid,
  LiaListUlSolid,
  LiaYinYangSolid,
  LiaFileAltSolid,
} from 'react-icons/lia'
import './Dashboard.scss'

const Dashboard = () => {
  const LinkRoute = {
    'create account': 'create',
    'bank accounts': 'accounts',
    reconcile: 'reconcile',
    reports: 'reports',
  }

  const icons = {
    'create account': <LiaPlusSquareSolid className='icon' />,
    'bank accounts': <LiaListUlSolid className='icon' />,
    reconcile: <LiaYinYangSolid className='icon' />,
    reports: <LiaFileAltSolid className='icon' />,
  }

  return (
    <div className='dashboard'>
      <div className='dashboard_container'>
        {['create account', 'bank accounts', 'reconcile', 'reports'].map(
          (btn) => (
            <Link key={btn} to={LinkRoute[btn]} className='dashboard_btn'>
              {icons[btn]}
              <span>{btn}</span>
            </Link>
          )
        )}
      </div>
    </div>
  )
}

export default Dashboard
