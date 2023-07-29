import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/Context'

const ReconciledTranfers = () => {
  const { reconciledAccountsState, setReconciledAccountsState } =
    useGlobalContext()
  const navigate = useNavigate()
  const handleGoBack = () => {
    navigate(-1)
  }
  return (
    <div className='pad30'>
      <h3 className='h3'>Reconciled Transfers</h3>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Account Name</th>
              <th>Account Number</th>
              <th>No. of Transaction</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {reconciledAccountsState &&
              reconciledAccountsState.map((obj, i) => (
                <tr key={obj.id}>
                  <td>{i + 1}</td>
                  <td>{obj.name}</td>
                  <td>{obj.number}</td>
                  <td>{obj.numberOfTransactions}</td>
                  <td>
                    {obj.reconcileAmount.toLocaleString(undefined, {
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

export default ReconciledTranfers
