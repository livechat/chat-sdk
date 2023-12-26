import React, { createContext, useEffect, useState } from 'react'
import SignIn from '../Components/SignIn'
import { useAuth } from '../hooks/use-auth'
import { ChatSDK } from '../utils/chat-sdk'

export const AuthContext = createContext({})

const AuthProvider = ({ children }) => {
  const {
    isLoggedIn,
    accessToken,
    isLoading,
    error,
    signInWithPopup,
    accountDetails
  } = useAuth();

  const [isSDKReady, setIsSDKReady] = useState(false);
  const isLoadingSDK = !isSDKReady && isLoggedIn

  useEffect(() => {
    if (isLoggedIn) {
      ChatSDK.init({ access_token: accessToken });
      return ChatSDK.destroy;
    }
  }, [isLoggedIn, accessToken]);

  useEffect(() => {
    const setReadyFlag = () => setIsSDKReady(true)

    ChatSDK.on("ready", setReadyFlag)
    return () => {
      ChatSDK.off("ready", setReadyFlag)
    }
  }, [])

  return (
    <AuthContext.Provider value={accountDetails}>
      {(isLoggedIn && isSDKReady)
        ? children
        : <SignIn isLoading={isLoading || isLoadingSDK} error={error} openPopup={signInWithPopup} />
      }
    </AuthContext.Provider>
  )
}

export default AuthProvider
