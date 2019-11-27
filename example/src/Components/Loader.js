import React from "react";
import { Loader } from "@livechat/design-system";
import styled from "styled-components";

const LoaderWrapper = styled.div`
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-content: center;
`;

const LoaderComponent = () => (
  <LoaderWrapper>
    <Loader size="medium" />
  </LoaderWrapper>
);

export default LoaderComponent;
