import React, { useEffect, useState } from 'react'
import { useGlobalContext } from './context/Context'
import newRequest from '../utils/newRequest'
import { useNavigate } from 'react-router-dom'
import { reconcile } from '../utils/reconcile'

const SetDelayDays = () => {
  const {
    accountsToMapTo,
    accountsToMapToId,
    setAccountsToMapTo,
    accounToReconcile,
    setMisMatched,
    setMatched,
    setIsPending,
    reconciledAccountsState,
    setReconciledAccountsState,
  } = useGlobalContext()
  const [delayDays, SetDelayDays] = useState(0)

  const handleDaysChange = (event) => {
    const { value } = event.target
    SetDelayDays(value)
  }

  console.log('accountsToMapT0========', accountsToMapTo)
  console.log('accounToReconcile', accounToReconcile)

  const navigate = useNavigate()

  const handleReconcile = async () => {
    setIsPending(true)
    let result
    try {
      const res = await newRequest.get('/reconcile', {
        params: { accountIds: accountsToMapToId },
      })

      const multipleObjects = res.data

      const multipleArrays = multipleObjects.map((obj) => obj.jsonData)

      console.log('-----multipleArrays-------', multipleArrays)
      const accountToReconcileData = accounToReconcile.jsonData

      console.log('-----accountToReconcileData-------', accountToReconcileData)
      result = reconcile(accountToReconcileData, multipleArrays, delayDays)

      const currentDate = new Date()

      const formattedDate = `${currentDate.getDate()}/${
        currentDate.getMonth() + 1
      }/${currentDate.getFullYear()}`

      const reconciledObj = result.matched?.map((obj) => obj.singleEntry)

      const reconcileAmount = calculateTotalDebitAmount(reconciledObj)
      console.log('reconcileAmount', reconcileAmount)
      // const unknownAmount = calculateTotalDebitAmount(result.misMatched)

      const unknownAmount = result.misMatched?.reduce((accumulator, obj) => {
        const amountAsNumber = parseFloat(obj.debitamount)
        if (!isNaN(amountAsNumber)) {
          return accumulator + amountAsNumber
        }
        return accumulator
      }, 0)

      console.log('unknownAmount', unknownAmount)
      function calculateTotalDebitAmount(objArray) {
        let totalDebitAmount = 0

        for (const obj of objArray) {
          const debitAmountString = obj.debitamount
          const debitAmountNumber = Number(debitAmountString)
          totalDebitAmount += debitAmountNumber
        }

        return totalDebitAmount
      }

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

      console.log('matched', result.matched) // Output: An array of matched objects
      console.log('misMatched', result.misMatched) // Output: An array of mismatched objects
    } catch (error) {
      setIsPending(false)
      console.log('Reconcile Error', error)
    } finally {
      if (result) {
        setIsPending(false)
        navigate('/reports')
        setAccountsToMapTo([])
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
    </div>
  )
}

export default SetDelayDays
