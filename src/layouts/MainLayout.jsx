import React, { useEffect, useState } from 'react'
import './Layout.scss'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/nav/Navbar'
import TopBar from '../components/TopBar'
import SuccessModal from '../components/SuccessModal'
import SpinnerLoader from '../components/loader/SpinnerLoader'
import ErrorModal from '../components/ErrorModal'
import { useGlobalContext } from '../components/context/Context'
import SetDelayDays from '../components/SetDelayDays'

const MainLayout = () => {
  const [toggle, setToggle] = useState(false)
  const [errorMsg, setErrorMsg] = useState()
  console.log('error', errorMsg)

  const { open, setOpen, isPending, setIsPending } = useGlobalContext()

  useEffect(() => {
    let timeId

    if (errorMsg) {
      timeId = setTimeout(() => {
        setOpen((prevState) => ({
          ...prevState,
          errorModal: !prevState.errorModal,
        }))
        setErrorMsg('')
      }, 3000)
    }

    return () => {
      clearTimeout(timeId)
    }
  }, [errorMsg])

  return (
    <div>
      {isPending && <SpinnerLoader />}
      <div className='layout'>
        <SuccessModal open={open.successModal} onClose={() => setOpen(false)} />
        <ErrorModal
          open={open.errorModal}
          onClose={() => setOpen(false)}
          errorMsg={errorMsg}
        />
        <section className='layout__nav'>
          <Navbar toggle={toggle} />
        </section>
        <main className='layout__main'>
          <TopBar setToggle={() => setToggle(!toggle)} />
          <div className='outlet-view'>
            <Outlet context={[isPending, setIsPending]} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
