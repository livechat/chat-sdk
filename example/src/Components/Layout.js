import React from "react";
import styled from "@emotion/styled";
import Navigation from "./Navigation";

const Background = styled.div`
  background: ${({ theme }) => theme.background};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

const AppWrapper = styled.div`
  width: 95%;
  max-width: 1000px;
  height: 700px;
  box-sizing: border-box;
  border-radius: 10px;
  background: ${({ theme }) => theme.white};
  border: 2px solid ${({ theme }) => theme.secondary};
  box-shadow: 0px 0px 15px 0px rgba(51, 51, 51, 0.1);
`;

const Layout = ({ children, hideNavigation }) => (
  <Background>
    <AppWrapper>
      {!hideNavigation && <Navigation />}
      {children}
    </AppWrapper>
  </Background>
)


export default Layout;
