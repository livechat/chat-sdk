import React from "react";
import { ThemeProvider } from '@emotion/react'
import { theme } from "./constants";
import ChatProvider from './context/chat'
import NavigationProvider from './context/navigation'
import AuthProvider from './context/auth'
import Layout from "./Components/Layout";
import Router from "./Components/Router";

const App = () => (
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <NavigationProvider>
        <ChatProvider>
          <Layout>
            <Router />
          </Layout>
        </ChatProvider>
      </NavigationProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
