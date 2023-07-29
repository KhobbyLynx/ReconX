function convertToUniformDateFormat(dateString) {
  // Check if the date string is in the "yyyy-mm-dd" format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const parts = dateString.split('-')
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }

  // Check if the date string is in the "dd/mm/yyyy" format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return dateString
  }

  // Return the original date string if it's not in the expected formats
  return dateString
}

function reconcile(singleAccount, multipleAccounts, delayDays = 0) {
  singleAccount = singleAccount.filter((entry) => {
    const debitAmount = entry['DEBIT AMOUNT']
    if (debitAmount) {
      // Add a check to ensure debitAmount is defined before using replace
      const parsedDebitAmount = parseFloat(debitAmount.replace(/[^\d.-]/g, ''))
      return !isNaN(parsedDebitAmount)
    }
    return false
  })
  multipleAccounts = multipleAccounts.flat().filter((entry) => {
    const creditAmount = entry['CREDIT AMOUNT']
    if (creditAmount) {
      // Add a check to ensure creditAmount is defined before using replace
      const parsedCreditAmount = parseFloat(
        creditAmount.replace(/[^\d.-]/g, '')
      )
      return !isNaN(parsedCreditAmount)
    }
    return false
  })

  console.log(singleAccount.length)
  console.log(multipleAccounts.length)

  const matched = []
  const misMatched = []

  for (const singleEntry of singleAccount) {
    const dateStr = singleEntry['VALUE DATE']
    const formatedDateStr = convertToUniformDateFormat(dateStr)
    console.log('dateStr', dateStr)
    console.log('formatedDateStr', formatedDateStr)
    const [day, month, year] = formatedDateStr.split('/').map(Number)
    const debitDate = new Date(year, month - 1, day)
    const startTimestamp = debitDate.getTime()
    const endTimestamp = debitDate.getTime() + delayDays * 86400000

    const debitAmount = parseFloat(
      singleEntry['DEBIT AMOUNT'].replace(/[^\d.-]/g, '')
    )

    let foundMatch = false

    for (let i = 0; i < multipleAccounts.length; i++) {
      const entry = multipleAccounts[i]
      const dateStr = entry['VALUE DATE']
      const formatedDateStr = convertToUniformDateFormat(dateStr)
      const [day, month, year] = formatedDateStr.split('/').map(Number)
      const creditDate = new Date(year, month - 1, day)
      const timestamp = creditDate.getTime()

      const creditAmount = parseFloat(
        entry['CREDIT AMOUNT'].replace(/[^\d.-]/g, '')
      )

      if (
        timestamp >= startTimestamp &&
        timestamp <= endTimestamp &&
        debitAmount === creditAmount
      ) {
        matched.push({ singleEntry, matchedEntry: entry })
        foundMatch = true
        multipleAccounts.splice(i, 1)
        break
      }
    }

    if (!foundMatch) {
      misMatched.push(singleEntry)
    }
  }

  return { matched, misMatched }
}

export { reconcile }
