import newRequest from '../utils/newRequest'

export const getAccounts = async () => {
  const res = await newRequest.get('/accounts')

  return res.data
}
