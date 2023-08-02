import React, { useEffect, useState } from 'react'
import { useGlobalContext } from './context/Context'
import { Link, useNavigate, useParams } from 'react-router-dom'

const ReconciledAccountDetails = () => {
  const { reconciledAccountsState } = useGlobalContext()
  const [paginatedData, setPaginatedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const { id } = useParams()

  const selectedAccount = reconciledAccountsState.filter(
    (obj) => obj.id === id
  )[0].matched

  console.log('>>Selected Accounts<<', selectedAccount)

  // Calculate the start and end index of the current page's data
  const pageSize = 10

  // Define the handlePageChange function
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  useEffect(() => {
    // Calculate totalPages based on the totalItems and pageSize
    setTotalPages(Math.ceil(selectedAccount.length / pageSize))

    // Update paginatedData whenever data or currentPage changes
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    if (startIndex < selectedAccount.length) {
      setPaginatedData(selectedAccount.slice(startIndex, endIndex))
    }
  }, [selectedAccount, currentPage])

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

  const navigate = useNavigate()
  const handleGoBack = () => {
    navigate(-1)
  }

  const trElements = paginatedData.map((entry, index) => {
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
      {selectedAccount.length < 1 && <span>No Records</span>}
      <div className='pagination-btns'>{renderPaginationButtons()}</div>
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
