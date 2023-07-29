import React, { useEffect, useState } from 'react'
import './AccountDetails.scss'

import TransactionDetails from '../transactionsDetails/TransactionDetails'
import AccountInfo from '../account/AccountInfo'
import { useParams } from 'react-router-dom'
import newRequest from '../../utils/newRequest'
import { useGlobalContext } from '../context/Context'

const AccountDetails = () => {
  const { setIsPending, isPending } = useGlobalContext()
  const [accountData, setAccountData] = useState({})
  const { id } = useParams()

  const [data, setData] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const accountDataArray = accountData.file
  const totalTransactions = accountData.file?.length

  function formatDate(date) {
    if (!date) return
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  console.log('<<<<<<<<<accountData>>>>>>>>', accountData)

  // const postDates = accountData?.map((obj) => new Date(obj['POST DATE']))
  // const minDate = new Date(Math.min(...postDates))
  // const maxDate = new Date(Math.max(...postDates))
  // console.log('POST DATES+++++++', postDates)

  // const formattedMinDate = formatDate(minDate)
  // const formattedMaxDate = formatDate(maxDate)

  const totalCreditAmount = calculateTotalAmount(
    accountDataArray,
    'CREDIT AMOUNT'
  )
  const totalDebitAmount = calculateTotalAmount(
    accountDataArray,
    'DEBIT AMOUNT'
  )

  const balance = totalCreditAmount - totalDebitAmount
  function calculateTotalAmount(accountDataArray, key) {
    // Function to find the key in a case-insensitive manner
    function findKey(obj, key) {
      const lowercaseKeys = Object.keys(obj).map((k) => k.toLowerCase())
      const lowercaseKeyIndex = lowercaseKeys.indexOf(key.toLowerCase())
      return lowercaseKeyIndex !== -1
        ? Object.keys(obj)[lowercaseKeyIndex]
        : undefined
    }

    const totalAmount = accountDataArray?.reduce((accumulator, obj) => {
      const actualKey = findKey(obj, key)
      if (actualKey !== undefined) {
        const amountWithoutComma = obj[actualKey].replace(/,/g, '')
        const amountAsNumber = parseFloat(amountWithoutComma)
        if (!isNaN(amountAsNumber)) {
          return accumulator + amountAsNumber
        }
      }
      return accumulator
    }, 0)

    return totalAmount
  }

  useEffect(() => {
    fetchArrayData(currentPage)
  }, [currentPage])

  const fetchArrayData = async (pageNumber) => {
    setIsPending(true)
    try {
      const response = await newRequest.get(
        `/accounts/${id}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        { params: { accountId: id } }
      )
      console.log('<<<<<response>>>>>', response)
      setData(response.data.file)
      setTotalPages(response.data.totalPages)
      setAccountData(response.data)
      setIsPending(false)
    } catch (error) {
      console.error('Error fetching array data:', error)
      setIsPending(false)
    }
  }
  const maxPaginationButtons = 5 // Change this value to adjust the number of pagination buttons

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

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

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={i === currentPage}
        >
          {i}
        </button>
      )
    }

    if (currentPage > 1) {
      buttons.unshift(
        <button key='prev' onClick={() => handlePageChange(currentPage - 1)}>
          Previous
        </button>
      )
    }

    if (currentPage < totalPages) {
      buttons.push(
        <button key='next' onClick={() => handlePageChange(currentPage + 1)}>
          Next
        </button>
      )
    }

    return buttons
  }
  // const getSingleAccount = async () => {
  //   setIsPending(true)
  //   try {
  //     const res = await newRequest.get(`/accounts/${id}`)
  //     console.log('SingleAccountData', res.data)
  //     setAccountData(res.data)
  //     setIsPending(false)
  //   } catch (error) {
  //     console.log(error)
  //     setIsPending(false)
  //   }
  // }

  // useEffect(() => {
  //   getSingleAccount()
  // }, [])
  // console.log('accountData', )
  return (
    <div>
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
                  {/* <th>Period</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{accountData?.name}</td>
                  <td>{accountData?.number}</td>
                  <td>{accountData?.bank}</td>
                  <td>{accountData?.branch}</td>
                  <td>{totalTransactions}</td>
                  <td>
                    {totalCreditAmount &&
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
                  {/* <td>{`${formattedMinDate} - ${formattedMaxDate}`}</td> */}
                  {/* <td>Hellooo</td> */}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
              {data?.map((item, index) => (
                <tr key={index}>
                  <td>{item['POST DATE']}</td>
                  <td>
                    {item['PARTICULARS'] &&
                      item['PARTICULARS'].substring(0, 20) + '...'}
                  </td>
                  <td>{item['REFERENCE']}</td>
                  <td>{item['VALUE DATE']}</td>
                  <td>{item['DEBIT AMOUNT']}</td>
                  <td>{item['CREDIT AMOUNT']}</td>
                  <td>{item['BALANCE']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div>
            {/* {Array.from({ length: totalPages }, (_, index) => (
              <button key={index} onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            ))} */}
          </div>
          {renderPaginationButtons()}
        </div>
      </div>
    </div>
  )
}

export default AccountDetails
