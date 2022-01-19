import { useEffect, useState, useRef } from "react";
import AccountsSDK from '@livechat/accounts-sdk'

const ACCESS_TOKEN_KEY = 'access_token'

export const useAuth = () => {
  const [accountDetails, setAccountDetails] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const instance = useRef(null);

  const signInWithPopup = async () => {
    try {
      setIsLoading(true)
      const data = await instance.current.popup().authorize()

      if (data?.access_token) {
        const { access_token, ...details } = data

        setAccountDetails(details)
        setAccessToken(access_token)
        sessionStorage.setItem(ACCESS_TOKEN_KEY, access_token)
      } else {
        setAccessToken(null);
      }
    } catch (error) {
      console.error('Authorization error: ', error)
      
      setAccessToken(null);
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    instance.current = new AccountsSDK({
      client_id: process.env.REACT_APP_CLIENT_ID,
    })

    const checkIfLoggedIn = () => {
      const sessionToken = sessionStorage.getItem(ACCESS_TOKEN_KEY)
      setAccessToken(sessionToken)
      setIsLoading(false)
    }

    checkIfLoggedIn()
  }, [])

  return {
    accessToken,
    accountDetails,
    isLoggedIn: accessToken && !isLoading && !error,
    instance: instance.current || null,
    isLoading,
    error,
    signInWithPopup,
  };
}
