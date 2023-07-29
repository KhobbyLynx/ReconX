import React, { useEffect, useState } from 'react'
import './Reconcile.scss'
import newRequest from '../../utils/newRequest'
import { useGlobalContext } from '../context/Context'
import { Link, useNavigate } from 'react-router-dom'
import EmptyAccounts from '../emptyAccounts/EmptyAccounts'

const Reconcile = () => {
  const {
    accounts,
    setAccounts,
    setIsPending,
    checkedAccountId,
    setCheckedAccountId,
  } = useGlobalContext()

  const getAccounts = async () => {
    const res = await newRequest.get('/accounts')
    setAccounts(res.data)
  }

  useEffect(() => {
    getAccounts()
  }, [])

  const navigate = useNavigate()

  const handleClick = (accountId) => {
    navigate(`/reconcile/${accountId}`)
  }

  const handleBack = () => {
    navigate(-1)
  }
  return (
    <div className='bank-accounts'>
      <h3>Select one account to reconcile</h3>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th className='th'>No.</th>
              <th>account Name</th>
              <th>account number</th>
              <th>bank</th>
              <th>branch</th>
              <th>Select</th>
            </tr>
          </thead>
          {accounts.length !== 0 ? (
            <tbody>
              {accounts.map((account, i) => (
                <tr key={i}>
                  <td className='th'>{i + 1}</td>
                  <td>{account.name}</td>
                  <td>{account.number}</td>
                  <td>{account.bank}</td>
                  <td>{account.branch}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type='checkbox'
                      name={account.name}
                      checked={checkedAccountId === account._id}
                      onChange={() => setCheckedAccountId(account._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>
      </div>
      {accounts.length === 0 && (
        <div className='empty'>
          <EmptyAccounts />
        </div>
      )}
      <div className='btns'>
        <button className='btn-mv btn btn-pad' onClick={handleBack}>
          BACK
        </button>
        {accounts.length !== 0 ? (
          <button
            className='btn-wh btn btn-pad'
            onClick={() => handleClick(checkedAccountId)}
          >
            NEXT
          </button>
        ) : (
          <Link to='/create' className='btn-wh btn btn-pad link'>
            CREATE ACCOUNT
          </Link>
        )}
      </div>
    </div>
  )
}

export default Reconcile