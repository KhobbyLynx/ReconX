import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/Context'

const ReconciledAccounts = () => {
  const { reconciledAccountsState } = useGlobalContext()
  const reconciledAccounts = reconciledAccountsState.map((obj) => obj)
  const navigate = useNavigate()
  const handleGoBack = () => {
    navigate(-1)
  }

  const handleDetails = (id) => {
    navigate(`/reports/reconciled-accounts/${id}`)
  }
  return (
    <div className='pad30'>
      <h3 className='h3'>Reconciled Accounts</h3>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Account Name</th>
              <th>Account Number</th>
              <th>Bank</th>
              <th>Reconcile Date</th>
              <th>Reconcile Amount</th>
              <th>Unknown Amount</th>
            </tr>
          </thead>
          <tbody>
            {reconciledAccountsState.map((obj, i) => (
              <tr onClick={() => handleDetails(obj.id)} key={i}>
                <td>{i + 1}</td>
                <td>{obj.name}</td>
                <td>{obj.number}</td>
                <td>{obj.bank}</td>
                <td>{obj.reconcileDate}</td>
                <td>
                  {obj.reconcileAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td>
                  {obj.unknownAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='btns'>
        <button className='btn-mv btn btn-pad' onClick={handleGoBack}>
          BACK
        </button>
      </div>
    </div>
  )
}

export default ReconciledAccounts
