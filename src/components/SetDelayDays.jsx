import React, { useEffect, useState } from 'react'
import { useGlobalContext } from './context/Context'
import newRequest from '../utils/newRequest'
import { useNavigate } from 'react-router-dom'
import { reconcile } from '../utils/reconcile'

const SetDelayDays = () => {
  const {
    checkedAccountId,
    accountsToMapTo,
    accountsToMapToId,
    setAccountsToMapTo,
    accounToReconcile,
    setIsPending,
    reconciledAccountsState,
    setReconciledAccountsState,
  } = useGlobalContext()
  const [delayDays, SetDelayDays] = useState(0)
  const [isValidInput, setIsValidInput] = useState(true)
  const [msg, setMsg] = useState('')

  const handleDaysChange = (event) => {
    const { value } = event.target

    // Ensure the value is a valid number between 0 and 5
    const parsedValue = parseInt(value)
    setIsValidInput(!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 5)
    SetDelayDays(value)
  }

  console.log('==========accountsToMapTo=========', accountsToMapTo)
  console.log('>>>>>>>>accounToReconcile<<<<<<<<<', accounToReconcile)

  const navigate = useNavigate()

  const handleReconcile = async () => {
    // Check if the input matches the regex pattern
    if (!isValidInput) {
      setMsg('Please enter a number between 0 and 5.')
      return
    }
    setIsPending(true)
    let result
    try {
      const res = await newRequest.get('/reconcile', {
        params: { accountIds: accountsToMapToId },
      })

      const multipleObjects = res.data

      const allArrays = []

      multipleObjects.forEach((obj) => {
        allArrays.push(...obj.processedData.jsonData)
      })

      console.log('-----multipleArrays-------', allArrays)
      const accountToReconcileData = accounToReconcile.jsonData

      console.log('>>>>>>>>accounToReconcile<<<<<<<<<', accounToReconcile)
      console.log('-----accountToReconcileData-------', accountToReconcileData)
      result = reconcile(accountToReconcileData, allArrays, delayDays)

      const currentDate = new Date()

      const formattedDate = `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`

      // Function to convert a string representing a number with commas to a numerical value
      function parseNumberWithCommas(numberString) {
        return parseFloat(numberString.replace(/,/g, ''))
      }

      // Calculate the total sum of debitamount in singleEntry objects
      let reconcileAmount = 0
      result.matched.forEach((entry) => {
        const debitAmount = entry.singleEntry.debitamount
        if (debitAmount !== undefined) {
          reconcileAmount += parseNumberWithCommas(debitAmount)
        }
      })

      // Calculate the total sum of debitamount in singleEntry objects
      // let reconcileAmount = 0
      // result.matched.forEach((entry) => {
      //   reconcileAmount += parseNumberWithCommas(entry.singleEntry.debitamount)
      // })

      console.log('reconciled amount', reconcileAmount)

      const unknownAmount = result.misMatched?.reduce((accumulator, obj) => {
        const amountAsNumber = obj.debitamount?.replace(/,/g, '')
        if (amountAsNumber !== undefined) {
          return accumulator + parseFloat(amountAsNumber)
        } else {
          return accumulator
        }
      }, 0)

      console.log('unknownAmount', unknownAmount)
      // function calculateTotalDebitAmount(objArray) {
      //   let totalDebitAmount = 0

      //   for (const obj of objArray) {
      //     const debitAmountString = obj.debitamount
      //     const debitAmountNumber = Number(debitAmountString)
      //     totalDebitAmount += debitAmountNumber
      //   }

      //   return totalDebitAmount
      // }

      let newReconciledAccounts = {
        id: accounToReconcile._id,
        name: accounToReconcile.name,
        number: accounToReconcile.number,
        bank: accounToReconcile.bank,
        numberOfTransactions: result.matched.length + result.misMatched.length,
        reconcileDate: formattedDate,
        reconcileAmount,
        unknownAmount,
        misMatched: result.misMatched,
        matched: result.matched,
      }

      setReconciledAccountsState([
        ...reconciledAccountsState,
        newReconciledAccounts,
      ])

      console.log('=========reconciledAccounts========', newReconciledAccounts)
      console.log('=========checkedAccountId========', checkedAccountId)

      console.log('matched', result.matched) // Output: An array of matched objects
      console.log('misMatched', result.misMatched) // Output: An array of mismatched objects

      // await newRequest.put(`/accounts?accountId=${checkedAccountId}`)
    } catch (error) {
      setIsPending(false)
      console.log('Reconcile Error', error)
    } finally {
      setIsPending(false)
      if (result) {
        navigate('/reports')
      }
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  console.log('delayDays', delayDays)

  return (
    <div className='modal'>
      <h3>Enter Delay Days</h3>

      <input type='number' value={delayDays} onChange={handleDaysChange} />
      <div className='btns'>
        <button className='btn-mv btn btn-pad' onClick={handleGoBack}>
          BACK
        </button>
        <button className='btn-tr btn btn-pad' onClick={handleReconcile}>
          RECONCILE
        </button>
      </div>
      {!isValidInput && <h6 className='error-msg'>{msg}</h6>}
    </div>
  )
}

export default SetDelayDays
