import React, { useEffect, useState } from 'react'
import './AccountInfo.scss'

const AccountInfo = ({ arrayOfObjs }) => {
  const accountInfo = arrayOfObjs?.file
  const valuedateArray = accountInfo?.filter((obj) =>
    obj.hasOwnProperty('VALUE DATE')
  )
  const totalTransactions = valuedateArray?.length

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  console.log('<<<<<<<<<arrayOfObjs>>>>>>>>', arrayOfObjs)

  // const postDates = arrayOfObjs?.map((obj) => new Date(obj['POST DATE']))
  // const minDate = new Date(Math.min(...postDates))
  // const maxDate = new Date(Math.max(...postDates))
  // console.log('POST DATES+++++++', postDates)

  // const formattedMinDate = formatDate(minDate)
  // const formattedMaxDate = formatDate(maxDate)

  const balance = calculateTotalAmount(arrayOfObjs, 'balance')
  const totalCreditAmount = calculateTotalAmount(arrayOfObjs, 'CREDIT AMOUNT')
  const totalDebitAmount = calculateTotalAmount(arrayOfObjs, 'DEBIT AMOUNT')

  function calculateTotalAmount(arrayOfObjs, key) {
    // Function to find the key in a case-insensitive manner
    function findKey(obj, key) {
      const lowercaseKeys = Object.keys(obj).map((k) => k.toLowerCase())
      const lowercaseKeyIndex = lowercaseKeys.indexOf(key.toLowerCase())
      return lowercaseKeyIndex !== -1
        ? Object.keys(obj)[lowercaseKeyIndex]
        : undefined
    }

    const totalAmount = arrayOfObjs?.reduce((accumulator, obj) => {
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

  return (
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
                <td>{arrayOfObjs?.name}</td>
                <td>{arrayOfObjs?.number}</td>
                <td>{arrayOfObjs?.bank}</td>
                <td>{arrayOfObjs?.branch}</td>
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
  )
}

export default AccountInfo
