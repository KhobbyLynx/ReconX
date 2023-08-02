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
  const [selectedRowIndex, setSelectedRowIndex] = useState(null)

  // Handle the click event on a table row
  const handleRowClick = (index) => {
    setSelectedRowIndex(index)
    const accountId = fileteredArray[index]._id
    setCheckedAccountId(accountId)
  }

  const getAccounts = async () => {
    setIsPending(true)
    setCheckedAccountId(null)
    try {
      const res = await newRequest.get('/accounts')

      setAccounts(res.data)
      setIsPending(false)
    } catch (error) {
      console.error('Error fetching array data:', error)
      setIsPending(false)
    }
  }

  const fileteredArray = accounts.filter(
    (account) => account.reconciled !== true
  )

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
              {fileteredArray.map((account, i) => (
                <tr
                  key={i}
                  className={i === selectedRowIndex ? 'selected-row' : ''}
                  onClick={() => handleRowClick(i)}
                >
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
        {checkedAccountId ? (
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
