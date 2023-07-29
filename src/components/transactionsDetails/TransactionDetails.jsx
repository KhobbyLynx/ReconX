import React, { useEffect, useState } from 'react'
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md'
import './TransactionDetails.scss'

const TransactionDetails = ({ transactions }) => {
  // const transactionsPerPage = 15
  // const [currentPage, setCurrentPage] = useState(1)
  // const [currentTransactions, setCurrentTransactions] = useState([])
  // console.log('jfnsfnssivskn', transactions)

  // useEffect(() => {
  //   // Update the currentTransactions state with the transactions for the current page
  //   const startIndex = (currentPage - 1) * transactionsPerPage
  //   const endIndex = startIndex + transactionsPerPage
  //   setCurrentTransactions(transactions.slice(startIndex, endIndex))
  // }, [currentPage, transactions])

  // const handleNextPage = () => {
  //   // Increment the current page by 1 when the "Next" button is clicked
  //   setCurrentPage((prevPage) => prevPage + 1)
  // }

  // const handlePrevPage = () => {
  //   // Decrement the current page by 1 when the "Previous" button is clicked
  //   setCurrentPage((prevPage) => (!prevPage ? prevPage - 1 : 1))
  // }
  return (
    <div className='transactions'>
      <h3>Transaction Details</h3>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Post date</th>
              <th>Particulars</th>
              <th>Reference</th>
              <th>Value date</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.map((data, index) => (
              <tr key={index}>
                <td>{data['POST DATE']}</td>
                <td>
                  {data['PARTICULARS'] &&
                    data['PARTICULARS'].substring(0, 20) + '...'}
                </td>
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
      <div>
        <button
          onClick={handlePrevPage}
          className={`bg-blue-500  flex justify-center px-3 py-2 ${
            currentPage === 1 ? ' hidden' : ''
          }`}
          disabled={currentPage === 1}
        >
          <MdNavigateBefore size={20} />
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage == transactions.length}
        >
          <MdNavigateNext size={20} />
        </button>
      </div>
    </div>
  )
}

export default TransactionDetails
