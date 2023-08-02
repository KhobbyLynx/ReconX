import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from './context/Context'

const UnknownTransfers = () => {
  const { reconciledAccountsState } = useGlobalContext()
  const [paginatedData, setPaginatedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const unknownTransfersArray = reconciledAccountsState.flatMap(
    (item) => item.misMatched
  )
  console.log('>>>>RECONX ACCOUNT STATE<<<<<', reconciledAccountsState)
  const navigate = useNavigate()
  const handleGoBack = () => {
    navigate(-1)
  }

  // Calculate the start and end index of the current page's data
  const pageSize = 10

  // Define the handlePageChange function
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  useEffect(() => {
    // Calculate totalPages based on the totalItems and pageSize
    setTotalPages(Math.ceil(unknownTransfersArray.length / pageSize))

    // Update paginatedData whenever data or currentPage changes
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    if (startIndex < unknownTransfersArray.length) {
      setPaginatedData(unknownTransfersArray.slice(startIndex, endIndex))
    }
  }, [unknownTransfersArray, currentPage])

  const maxPaginationButtons = 5

  const renderPaginationButtons = () => {
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxPaginationButtons / 2)
    )
    let endPage = Math.min(totalPages, startPage + maxPaginationButtons - 1)

    if (endPage - startPage < maxPaginationButtons - 1) {
      startPage = Math.max(1, endPage - maxPaginationButtons + 1)
    }

    const buttons = []

    if (currentPage > 1) {
      buttons.push(
        <button
          className='btn btn-mv pagination-btn'
          key='first'
          onClick={() => handlePageChange(1)}
        >
          First
        </button>
      )
      buttons.push(
        <button
          className='btn btn-wh pagination-btn'
          key='prev'
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
      )
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          className={`btn pagination-btn ${
            i === currentPage ? 'btn-tr' : 'btn-wh'
          }`}
          key={i}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      )
    }

    if (currentPage < totalPages) {
      buttons.push(
        <button
          className='btn btn-wh pagination-btn'
          key='next'
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      )
      buttons.push(
        <button
          className='btn btn-mv pagination-btn'
          key='last'
          onClick={() => handlePageChange(totalPages)}
        >
          Last
        </button>
      )
    }

    return buttons
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
              {paginatedData.map((data, index) => (
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
        {unknownTransfersArray.length < 1 && <span>No Records</span>}
        <div className='pagination-btns'>{renderPaginationButtons()}</div>
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
