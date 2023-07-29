import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from './context/Context'

const UnknownTransfers = () => {
  const { reconciledAccountsState } = useGlobalContext()

  const unknownTransfersArray = reconciledAccountsState.flatMap(
    (item) => item.misMatched
  )

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
              {unknownTransfersArray.map((data, index) => (
                <tr key={index}>
                  <td>{data['POST DATE']}</td>
                  <td>{data['PARTICULARS']}</td>
                  <td>{data['REFERENCE']}</td>
                  <td>{data['VALUE DATE']}</td>
                  <td>{data['DEBIT AMOUNT']}</td>
                  <td>{data['CREDIT AMOUNT']}</td>
                  <td>{data['BALANCE']}</td>
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
