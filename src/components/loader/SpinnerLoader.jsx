import React from 'react'
import MoonLoader from 'react-spinners/MoonLoader'

const SpinnerLoader = () => {
  return (
    <>
      <div className='overlay z-index' />
      <div className='request-loader'>
        <MoonLoader color='#5aae32' loading size={50} />
      </div>
    </>
  )
}

export default SpinnerLoader
