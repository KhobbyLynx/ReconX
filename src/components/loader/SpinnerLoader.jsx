import React from 'react'
import HashLoader from 'react-spinners/HashLoader'

const SpinnerLoader = () => {
  return (
    <>
      <div className='overlay z-index' />
      <div className='request-loader'>
        <HashLoader color='#5aae32' loading size={60} />
      </div>
    </>
  )
}

export default SpinnerLoader
