import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './components/dashboard/Dashboard'
import CreateAccount from './components/createAccount/CreateAccount'
import BankAccounts from './components/bankAccounts/BankAccounts'
import Reconcile from './components/reconcile/Reconcile'
import Reports from './components/reports/Reports'
import AccountDetails from './components/accountDetails/AccountDetails'
import ReconcileAgainst from './components/reconcileAgainst/reconcileAgainst'
import SetDelayDays from './components/SetDelayDays'
import ReconciledAccounts from './components/reconciledAccounts/ReconciledAccounts'
import ReconciledTranfers from './components/reconciledTranfers/ReconciledTranfers'
import UnknownTransfers from './components/UnknownTransfers'
import ReconciledAccountDetails from './components/ReconciledAccountDetails'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='create' element={<CreateAccount />} />
            <Route path='reconcile' element={<Reconcile />} />
            <Route path='reports' element={<Reports />} />
            <Route path='accounts' element={<BankAccounts />} />
            <Route path='accounts/:id' element={<AccountDetails />} />
            <Route path='reconcile/:id' element={<ReconcileAgainst />} />
            <Route path='delay' element={<SetDelayDays />} />
            <Route
              path='/reports/reconciled-accounts'
              element={<ReconciledAccounts />}
            />
            <Route
              path='/reports/reconciled-tranfers'
              element={<ReconciledTranfers />}
            />
            <Route
              path='/reports/unknown-transfers'
              element={<UnknownTransfers />}
            />
            <Route
              path='/reports/reconciled-accounts/:id'
              element={<ReconciledAccountDetails />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
