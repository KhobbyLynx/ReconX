import React from 'react'
import { useGlobalContext } from './context/Context'
import { Link, useNavigate, useParams } from 'react-router-dom'

const ReconciledAccountDetails = () => {
  const { reconciledAccountsState } = useGlobalContext()

  const navigate = useNavigate()
  const handleGoBack = () => {
    navigate(-1)
  }
  const { id } = useParams()

  const selectedAccount = reconciledAccountsState.filter(
    (obj) => obj.id === id
  )[0].matched
  const trElements = selectedAccount.map((entry, index) => {
    const debitDate = entry.singleEntry.postdate
    const creditDate = entry.matchedEntry.postdate
    const delayDays = Math.floor(
      creditDate.split('/')[0] - debitDate.split('/')[0]
    )
    const creditReference = entry.matchedEntry.reference
    const amount = parseFloat(entry.singleEntry.debitamount)

    return (
      <tr key={index}>
        <td>{debitDate}</td>
        <td>{creditDate}</td>
        <td>{`${delayDays}`}</td>
        <td>{creditReference}</td>
        <td>
          {amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </td>
      </tr>
    )
  })

  return (
    <div className='pad30'>
      <h3 className='h3'>Reconciled Account Details</h3>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Debit date</th>
              <th>Credit date</th>
              <th>Delay Days</th>
              <th>Credit Reference</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>{trElements}</tbody>
        </table>
      </div>
      {selectedAccount.length < 1 && <span>No Accounts</span>}
      <div className='btns'>
        <button className='btn-mv btn btn-pad' onClick={handleGoBack}>
          BACK
        </button>
        <Link to='/' className='btn-wh btn btn-pad link'>
          DASHBOARD
        </Link>
      </div>
    </div>
  )
}

export default ReconciledAccountDetails
