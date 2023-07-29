import React, { useEffect, useState } from 'react'
import './CreateAccount.scss'
import newRequest from '../../utils/newRequest'
import SuccessModal from '../SuccessModal'
import ErrorModal from '../ErrorModal'
import { useGlobalContext } from '../context/Context'

const CreateAccount = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    bank: 'Select Bank',
    branch: '',
    file: null,
  })

  const { setIsPending, open, setOpen } = useGlobalContext()

  const config = {
    headers: { 'Content-Type': 'multipart/form-data' },
  }

  function handleChange(event) {
    const { name, value, type, files } = event.target
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === 'file' ? files[0] : value,
      }
    })
  }

  useEffect(() => {
    let timeId

    if (errorMsg) {
      timeId = setTimeout(() => {
        setOpen((prevState) => ({
          ...prevState,
          errorModal: !prevState.errorModal,
        }))
        setErrorMsg('')
      }, 2000)
    }

    if (success) {
      timeId = setTimeout(() => {
        setOpen((prevState) => ({
          ...prevState,
          successModal: !prevState.successModal,
        }))
      }, 2000)
    }

    return () => {
      clearTimeout(timeId)
    }
  }, [errorMsg || success])

  function handleSubmit(event) {
    event.preventDefault()
    const { name, number, bank, branch, file } = formData

    setIsPending(true)

    const request = async () => {
      try {
        const res = await newRequest.post(
          '/accounts',
          {
            name,
            number,
            bank,
            branch,
            reconciled: false,
            file,
          },
          config
        )

        setOpen((prevState) => ({
          ...prevState,
          successModal: !prevState.successModal,
        }))

        console.log('success', success)
        console.log('response', res.data)

        if (res.data.name) {
          setSuccess(true)
          setFormData({
            name: '',
            number: '',
            bank: '',
            branch: '',
            file: null,
          })

          setTimeout(() => {
            setOpen(false)
            setSuccess(false)
          }, 2000)
        }
      } catch (error) {
        console.log(error)
        setErrorMsg(true)
        setOpen((prevState) => ({
          ...prevState,
          errorModal: !prevState.errorModal,
        }))

        const statusCode = error.response?.status
        if (statusCode === 400) {
          setErrorMsg(error.response.data.message)
        } else if (statusCode === 500) {
          setErrorMsg(error.response.statusText)
        } else setErrorMsg('something went wrong')
        return
      } finally {
        setIsPending(false)
      }
    }
    return request()
  }

  return (
    <div className='account'>
      <SuccessModal open={open.successModal} onClose={() => setOpen(false)} />
      <ErrorModal
        open={open.errorModal}
        onClose={() => setOpen(false)}
        errorMsg={errorMsg}
      />
      <fieldset>
        <legend className='styled-text'>Create a new Bank account</legend>
        <form onSubmit={handleSubmit}>
          <div className='input-container'>
            <label htmlFor='accName'>Account Name</label>
            <input
              type='text'
              name='name'
              id='accName'
              value={formData.name}
              onChange={handleChange}
              placeholder='enter account name'
              required
            />
          </div>
          <div className='input-container'>
            <label htmlFor='accNum'>Account Number</label>
            <input
              type='text'
              id='accNum'
              name='number'
              value={formData.number}
              onChange={handleChange}
              placeholder='enter account number'
              required
            />
          </div>
          <div className='input-container'>
            <label htmlFor='bank'>Bank</label>
            <select
              name='bank'
              onChange={handleChange}
              id='bank'
              defaultValue={formData.bank}
              required
            >
              {['Select Bank', 'ABSA', 'ADB', 'CALBANK', 'CBG', 'ECOBANK'].map(
                (bank) => (
                  <option
                    key={bank}
                    value={bank}
                    disabled={bank === 'Select Bank'}
                    className='options'
                  >
                    {bank}
                  </option>
                )
              )}
            </select>
          </div>
          <div className='input-container'>
            <label htmlFor='branch'>Branch</label>
            <input
              type='text'
              id='branch'
              name='branch'
              value={formData.branch}
              onChange={handleChange}
              placeholder='Enter Bank Branch'
              required
            />
          </div>
          <div className='btns-container'>
            <div className=''>
              <div className='file-input'>
                <label htmlFor='file'>Upload a File (.csv, .xlsx) </label>
                <input
                  type='file'
                  onChange={handleChange}
                  id='file'
                  name='file'
                  accept='.xlsx, .csv'
                  required
                />
              </div>
            </div>
            <button>Create Account</button>
          </div>
          {formData.file && formData.file.name}
        </form>
      </fieldset>
    </div>
  )
}

export default CreateAccount
