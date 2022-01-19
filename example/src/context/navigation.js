import React, { createContext, useState } from 'react'
import { navigationItem } from '../constants'

export const NavigationContext = createContext({})

const NavigationProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState(navigationItem.chats)

  return (
    <NavigationContext.Provider value={{
      setActiveTab,
      activeTab
    }}>
      {children}
    </NavigationContext.Provider>
  )
}

export default NavigationProvider
