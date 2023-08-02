import React, { createContext, useContext, useState } from 'react'

const AppContext = createContext()

const Context = ({ children }) => {
  const [accounts, setAccounts] = useState([])
  const [checkedAccountId, setCheckedAccountId] = useState(null)
  const [accountsToMapToId, setAccountsToMapToId] = useState([])
  const [accounToReconcile, setAccounToReconcile] = useState([])
  const [accountsToMapTo, setAccountsToMapTo] = useState([])
  const [isPending, setIsPending] = useState(false)
  const [matched, setMatched] = useState([])
  const [misMatched, setMisMatched] = useState([])
  const [reconciledAccountsState, setReconciledAccountsState] = useState([])
  const [open, setOpen] = useState({
    successModal: true,
    errorModal: false,
    delayDays: false,
  })

  return (
    <AppContext.Provider
      value={{
        accounts,
        setAccounts,
        open,
        setOpen,
        isPending,
        setIsPending,
        checkedAccountId,
        accounToReconcile,
        setCheckedAccountId,
        setAccounToReconcile,
        accountsToMapTo,
        setAccountsToMapTo,
        accountsToMapToId,
        setAccountsToMapToId,
        matched,
        setMatched,
        misMatched,
        setMisMatched,
        reconciledAccountsState,
        setReconciledAccountsState,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useGlobalContext = () => {
  return useContext(AppContext)
}

export { Context, useGlobalContext }
