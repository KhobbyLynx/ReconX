import React, { useEffect, useState } from 'react'
import './ReconcileAgainst.scss'
import { useGlobalContext } from '../context/Context'
import newRequest from '../../utils/newRequest'
import { useNavigate, useParams } from 'react-router-dom'

const ReconcileAgainst = () => {
  const {
    accounts,
    setAccounts,
    open,
    setOpen,
    checkedAccountId,
    accounToReconcile,
    setAccounToReconcile,
    accountsToMapTo,
    setAccountsToMapToId,
    accountsToMapToId,
    reconciledAccountsState,
  } = useGlobalContext()
  const [selectAll, setSelectAll] = useState(false)
  const { id } = useParams()

  const reconciledAccountsStateId = reconciledAccountsState.map((obj) => obj.id)
  const filteredArray = accounts.filter((account) => account._id !== id)
  const newArray = filteredArray.filter(
    (account) => account.reconciled !== true
  )

  const getAccounts = async () => {
    const res = await newRequest.get('/accounts')
    setAccounts(res.data)
  }

  const getAccountToReconcile = async () => {
    try {
      const res = await newRequest.get(`/reconcile/${checkedAccountId}`)
      setAccounToReconcile(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  console.log('AccountToReconcile', accounToReconcile)

  useEffect(() => {
    getAccounts()
    getAccountToReconcile()
  }, [])

  console.log('accountsToMapTo', accountsToMapTo)

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked)
    console.log('length', accounts.length, accountsToMapToId.length)
    if (accounts.length === accountsToMapToId?.length) setSelectAll(true)
    if (event.target.checked) {
      setAccountsToMapToId(accounts.map((account) => account._id))
    } else {
      setAccountsToMapToId([])
    }
  }

  const handleCheckboxChange = (event) => {
    const accountId = event.target.name
    setAccountsToMapToId((prevaccountsToMapToId) => {
      if (event.target.checked) {
        return [...prevaccountsToMapToId, accountId]
      } else {
        return prevaccountsToMapToId.filter((id) => id !== accountId)
      }
    })
  }

  console.log('accountsToMapToId', accountsToMapToId)
  // console.log('accounts', accounts)

  const navigate = useNavigate()
  const handleNextClick = () => {
    navigate('/delay')
  }

  const handleBack = () => {
    navigate(-1)
  }
  return (
    <div>
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
                <th>
                  <input
                    type='checkbox'
                    name='selectAll'
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {newArray.map((account, i) => (
                <tr key={i}>
                  <td className='th'>{i + 1}</td>
                  <td>{account.name}</td>
                  <td>{account.number}</td>
                  <td>{account.bank}</td>
                  <td>{account.branch}</td>
                  <td>
                    <input
                      type='checkbox'
                      name={account._id}
                      checked={accountsToMapToId.includes(account._id)}
                      onChange={handleCheckboxChange}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='btns'>
          <button className='btn-mv btn btn-pad' onClick={handleBack}>
            BACK
          </button>
          <button className='btn-wh btn btn-pad' onClick={handleNextClick}>
            NEXT
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReconcileAgainst
