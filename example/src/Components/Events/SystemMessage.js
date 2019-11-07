import React from "react";
import styled from "styled-components";

const MessageText = styled.small`
  display: block;
  width: 100%;
  margin: 10px;
  color: darkgray;
  text-align: center;
`;

const SystemMessage = ({ message }) => (
  <MessageText>{message.text}</MessageText>
);

export default SystemMessage;
