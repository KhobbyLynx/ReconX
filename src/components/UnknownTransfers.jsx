import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from './context/Context'

const UnknownTransfers = () => {
  const { reconciledAccountsState } = useGlobalContext()

  const unknownTransfersArray = reconciledAccountsState.flatMap(
    (item) => item.misMatched
  )
  const chunkOfUnknownTransfers = unknownTransfersArray.slice(0, 10)
  const navigate = useNavigate()
  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className='pad30'>
      <h3 className='h3'>Unknown Transfers</h3>
      <>
        <div className='table-container'>
          <table>
            <thead>
              <tr>
                <th>Post date</th>
                <th className='particulars'>Particulars</th>
                <th>Reference</th>
                <th>Value date</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {chunkOfUnknownTransfers.map((data, index) => (
                <tr key={index}>
                  <td>{data.postdate}</td>
                  <td>{data.particulars}</td>
                  <td>{data.reference}</td>
                  <td>{data.valuedate}</td>
                  <td>{data.debitamount}</td>
                  <td>{data.creditamount}</td>
                  <td>{data.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {unknownTransfersArray.length < 1 && <span>No Accounts</span>}
      </>
      <div className='btns'>
        <button className='btn-mv btn btn-pad' onClick={handleGoBack}>
          BACK
        </button>
      </div>
    </div>
  )
}

export default UnknownTransfers
