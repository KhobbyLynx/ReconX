import React, { useEffect, useState } from 'react'
import './AccountDetails.scss'

import { useParams } from 'react-router-dom'
import newRequest from '../../utils/newRequest'
import { useGlobalContext } from '../context/Context'
import memoryCache from 'memory-cache'

const formatDate = (inputDate) => {
  if (!inputDate || typeof inputDate !== 'string') {
    return '' // Return an empty string or some default value for invalid input
  }

  // Split the date using any separator (such as "/", "-", or ".")
  const parts = inputDate.split(/[/\-.]/)
  if (parts.length === 3) {
    // If the input date has three parts, assume it's in "dd/mm/yyyy" format
    const [day, month, year] = parts
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
  } else {
    // If the input date cannot be split into three parts, return the original input
    return inputDate
  }
}

const AccountDetails = () => {
  const { setIsPending, isPending } = useGlobalContext()
  const [accountData, setAccountData] = useState({})
  const { id } = useParams()

  const [data, setData] = useState([])

  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const [totalCreditAmount, setTotalCreditAmount] = useState(0)
  const [dateRange, setDateRange] = useState('')
  const [totalDebitAmount, setTotalDebitAmount] = useState(0)
  const [balance, setBalance] = useState(0)
  const [paginatedData, setPaginatedData] = useState([]) // Add paginatedData state

  const [totalTransactions, setTotalTransactions] = useState(0)

  // Calculate the start and end index of the current page's data
  const pageSize = 20

  useEffect(() => {
    // Update paginatedData whenever data or currentPage changes
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    if (startIndex < data.length) {
      setPaginatedData(data.slice(startIndex, endIndex))
    }
  }, [data, currentPage])

  useEffect(() => {
    fetchAccountData(currentPage)
  }, [currentPage])

  const fetchAccountData = async (pageNumber) => {
    setIsPending(true)
    try {
      // Check if the paginated data is already in the cache
      const cacheKey = `accountData_${id}_${pageNumber}`
      const cachedData = await fetchCachedData(cacheKey)

      if (cachedData) {
        console.log('=====ACCOUNT DATA FETCHED FROM CACHE=====', cachedData)
        updateStateWithCachedData(cachedData)
        setIsPending(false)
        return
      }

      // If not in cache, fetch the data from the server
      const response = await newRequest.get(`/accounts/${id}`, {
        params: { accountId: id, page: pageNumber },
      })

      console.log('<<<<<response>>>>>', response)

      const details = response.data
      const {
        jsonData,
        totalItems,
        totalCreditAmount,
        totalDebitAmount,
        dateRange,
      } = response.data
      setData(jsonData)
      setAccountData(details)
      setTotalTransactions(totalItems)
      setTotalCreditAmount(totalCreditAmount)
      setTotalDebitAmount(totalDebitAmount)
      setDateRange(dateRange)
      setBalance(totalCreditAmount - response.data.totalDebitAmount)

      // Store the paginated data in cache
      const cacheDuration = 60 * 60 * 1000 // 1 hour
      const cacheData = {
        details,
        jsonData,
        totalItems,
        totalCreditAmount,
        totalDebitAmount,
        dateRange,
      }

      await cacheDataInMemory(cacheKey, cacheData, cacheDuration)

      // Calculate totalPages based on the totalItems and pageSize
      const totalPages = Math.ceil(response.data.totalItems / pageSize)
      setTotalPages(totalPages)

      // Update the paginatedData state with the newly fetched data
      setPaginatedData(jsonData)

      setIsPending(false)
    } catch (error) {
      console.error('Error fetching account data:', error)
      setIsPending(false)
    }
  }

  const fetchCachedData = async (cacheKey) => {
    // Check if the data is in the cache
    const cachedData = memoryCache.get(cacheKey)

    // Return the cached data if available, otherwise return null
    return cachedData || null
  }

  const cacheDataInMemory = async (cacheKey, data, cacheDuration) => {
    // Convert the cache duration from minutes to milliseconds
    const cacheDurationMillis = cacheDuration * 60 * 1000

    // Store the data in the cache with the provided cacheKey and cacheDuration
    memoryCache.put(cacheKey, data, cacheDurationMillis)
  }

  const updateStateWithCachedData = (cachedData) => {
    const accDetails = cachedData.details
    setData(cachedData.jsonData)
    setAccountData(accDetails)
    setTotalTransactions(cachedData.totalItems)
    setTotalCreditAmount(cachedData.totalCreditAmount)
    setTotalDebitAmount(cachedData.totalDebitAmount)
    setDateRange(cachedData.dateRange)
    setBalance(cachedData.totalCreditAmount - cachedData.totalDebitAmount)
    setPaginatedData(cachedData.jsonData)
  }

  const handlePageChange = async (pageNumber) => {
    console.log('=====Page Change Requested=====', pageNumber)
    setCurrentPage(pageNumber)

    // Check if the paginated data is already in the cache
    const cacheKey = `accountData_${id}_${pageNumber}`
    const cachedData = await fetchCachedData(cacheKey)

    if (cachedData) {
      console.log('=====ACCOUNT DATA FETCHED FROM CACHE=====', cachedData)
      // Update the state with the cached data
      updateStateWithCachedData(cachedData)
    } else {
      console.log('=====FETCHING ACCOUNT DATA FROM SERVER=====')
      // Fetch the data from the server
      fetchAccountData(pageNumber)
    }
  }

  const maxPaginationButtons = 5

  const renderPaginationButtons = () => {
    if (isPending) {
      return <div>Loading...</div>
    }

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
    <div className='detailed'>
      <div className='account-details'>
        <h3>Account Details</h3>
        <div className='mini'>
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Account Name</th>
                  <th>account number</th>
                  <th>bank</th>
                  <th>branch</th>
                  <th>Number of transactions</th>
                  <th>Total Debit</th>
                  <th>Total Credit</th>
                  <th>Balance</th>
                  <th>Period</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{accountData?.name}</td>
                  <td>{accountData?.number}</td>
                  <td>{accountData?.bank}</td>
                  <td>{accountData?.branch}</td>
                  <td>
                    {totalTransactions.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td>
                    {totalDebitAmount &&
                      totalDebitAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </td>
                  <td>
                    {totalCreditAmount &&
                      totalCreditAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </td>
                  <td>
                    {balance &&
                      balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </td>
                  <td>{dateRange}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className='transactions'>
        <h3 className='h3'>Transaction Details</h3>
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
              {paginatedData?.map((item, index) => (
                <tr key={index}>
                  <td>{item.postdate}</td>
                  <td>{item.particulars}</td>
                  <td>{item.reference}</td>
                  <td>{item.valuedate}</td>
                  <td>{item.debitamount}</td>
                  <td>{item.creditamount}</td>
                  <td>
                    {item.balance?.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='pagination-btns'>{renderPaginationButtons()}</div>
      </div>
    </div>
  )
}

export default AccountDetails
