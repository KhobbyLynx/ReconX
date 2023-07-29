import React from 'react'
import './Reports.scss'
import { Link } from 'react-router-dom'
import { MdOutlineGppGood } from 'react-icons/md'
import { LiaYinYangSolid } from 'react-icons/lia'
import { BiSolidErrorAlt } from 'react-icons/bi'
import { useGlobalContext } from '../context/Context'

const Reports = () => {
  const { reconciledAccountsState, accounts } = useGlobalContext()

  console.log('==============ACCOUNTS+++++++++', reconciledAccountsState)
  const LinkRoute = {
    'reconciled accounts': 'reconciled-accounts',
    'reconciled transfers': 'reconciled-tranfers',
    'unknown transfers': 'unknown-transfers',
  }

  const icons = {
    'reconciled accounts': <LiaYinYangSolid className=' reports-icon' />,
    'reconciled transfers': <MdOutlineGppGood className=' reports-icon' />,
    'unknown transfers': <BiSolidErrorAlt className=' reports-icon' />,
  }

  // const totalCost = arrayOfObjects.reduce((accumulator, currentObject) => {
  //   return accumulator + currentObject.cost
  // }, 0)

  const floatReconcileAmount = reconciledAccountsState?.reduce((acc, obj) => {
    return acc + obj.reconcileAmount
  }, 0)

  const formatedReconcileAmount = floatReconcileAmount.toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )
  const floatunknownAmount = reconciledAccountsState?.reduce((acc, obj) => {
    return acc + obj.unknownAmount
  }, 0)

  const formatedUnknownAmount = floatunknownAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const value = {
    'reconciled accounts': reconciledAccountsState.length,
    'reconciled transfers': formatedReconcileAmount
      ? formatedReconcileAmount
      : '0.00',
    'unknown transfers': formatedUnknownAmount ? formatedUnknownAmount : '0.00',
  }
  const acc = {
    'reconciled accounts': accounts.length,
    'reconciled transfers': reconciledAccountsState.length,
    'unknown transfers': reconciledAccountsState.length,
  }
  return (
    <div className='dashboard'>
      <div className='dashboard_container'>
        {[
          'reconciled accounts',
          'reconciled transfers',
          'unknown transfers',
        ].map((btn) => (
          <Link
            key={btn}
            to={LinkRoute[btn]}
            className='dashboard_btn report-btn-bg'
          >
            {icons[btn]}
            <div className='reports-span'>
              <span className='reports-name'>{btn}</span>
              <span className='reports-figure'>{value[btn]}</span>
              <p className='num-of-accounts'>
                On <span className='num-of-accounts__num'>{acc[btn]}</span>{' '}
                account(s)
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Reports
