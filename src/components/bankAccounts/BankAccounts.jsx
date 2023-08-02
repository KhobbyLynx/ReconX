import React, { useEffect, useState } from 'react'
import './BankAccounts.scss'
import { useGlobalContext } from '../context/Context'
import newRequest from '../../utils/newRequest'
import { Link, useNavigate } from 'react-router-dom'
import EmptyAccounts from '../emptyAccounts/EmptyAccounts'

const BankAccounts = () => {
  const { accounts, setAccounts, setIsPending, reconciledAccountsState } =
    useGlobalContext()
  const [selectedAccounts, setSelectedAccounts] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const getAccounts = async () => {
    setIsPending(true)
    try {
      const res = await newRequest.get('/accounts')
      setAccounts(res.data)
      setIsPending(false)
    } catch (error) {
      console.log(error)
      setIsPending(false)
    }
  }

  useEffect(() => {
    getAccounts()
  }, [])

  const navigate = useNavigate()

  const handleRowClick = (accountId) => {
    navigate(`/accounts/${accountId}`)
  }

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked)
    if (accounts.length === selectedAccounts.length) setSelectAll(true)
    if (event.target.checked) {
      setSelectedAccounts(accounts.map((account) => account._id))
    } else {
      setSelectedAccounts([])
    }
  }

  const handleCheckboxChange = (event) => {
    setSelectAll(false)
    const accountId = event.target.name
    setSelectedAccounts((prevSelectedAccounts) => {
      if (event.target.checked) {
        return [...prevSelectedAccounts, accountId]
      } else {
        return prevSelectedAccounts.filter((id) => id !== accountId)
      }
    })
  }

  const handleDelete = async () => {
    setIsPending(true)
    try {
      await newRequest.delete('/accounts', {
        data: { accountIds: selectedAccounts },
      })
      // After successful deletion, update the accounts state to reflect the changes
      setAccounts((prevAccounts) =>
        prevAccounts.filter(
          (account) => !selectedAccounts.includes(account._id)
        )
      )

      // Clear the selectedAccounts state after deletion
      setSelectedAccounts([])
      setSelectAll(false)
      setIsPending(false)
    } catch (error) {
      setIsPending(false)
      console.log('Error deleting account(s):', error)
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  // if (!accounts) {
  //   setIsPending(true)
  // }

  const reconciledAccountsStateId = reconciledAccountsState.map((obj) => obj.id)
  const newArray = accounts.filter(
    (account) => account._id !== reconciledAccountsStateId
  )

  return (
    <div className='bank-accounts'>
      <h3>Bank Account(s)</h3>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th className='th'>No.</th>
              <th>account Name</th>
              <th>account number</th>
              <th>bank</th>
              <th>branch</th>
              {accounts.length !== 0 && (
                <th>
                  <input
                    id='selectAll'
                    type='checkbox'
                    name='selectAll'
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </th>
              )}
            </tr>
          </thead>
          {accounts.length !== 0 ? (
            <tbody>
              {newArray.map((account, i) => (
                <tr
                  key={account.name + i}
                  onClick={() => handleRowClick(account._id)}
                >
                  <td className='th'>{i + 1}</td>
                  <td>{account.name}</td>
                  <td>{account.number}</td>
                  <td>{account.bank}</td>
                  <td>{account.branch}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type='checkbox'
                      name={account._id}
                      checked={selectedAccounts.includes(account._id)}
                      onChange={handleCheckboxChange}
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
        <button className='btn-mv btn btn-pad' onClick={handleGoBack}>
          BACK
        </button>
        {selectedAccounts.length !== 0 ? (
          <button className='btn-wh btn btn-pad delBtn' onClick={handleDelete}>
            DELETE
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

export default BankAccounts
