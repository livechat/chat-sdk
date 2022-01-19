import React from 'react'
import Layout from './Layout'
import styled from "@emotion/styled";
import { ReactComponent as LiveChatLogo } from "../assets/livechat-logo.svg";
import { Button } from '@livechat/design-system';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  > button {
    width: 140px;
  }
`

const Logo = styled(LiveChatLogo)`
  margin-bottom: 1rem;
`

const ErrorMessage = styled.pre`
  width: 70%;
  white-space: break-spaces;
  text-align: center;
`

const SignIn = ({ isLoading, error, openPopup }) => (
  <Layout hideNavigation>
    <Wrapper>
      <Logo />

      {error
        ? <ErrorMessage>{error?.description || error?.message || error.toString()}</ErrorMessage>
        : <Button kind='primary' onClick={openPopup} loading={isLoading} loaderLabel="Signing in">Sign In</Button>
      }
    </Wrapper>
  </Layout>
)

export default SignIn
