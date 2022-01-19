import React from "react";
import styled from "@emotion/styled";

const MessageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: ${({ isCustomer }) =>
    isCustomer ? "flex-start" : "flex-end"};
`;

const MessageAuthor = styled.small`
  position: absolute;
  top: -3px;
`;

const MessageText = styled.p`
  padding: 1rem;
  background: ${({ isCustomer, theme }) =>
    isCustomer ? theme.secondary : theme.primary};
  color: ${({ isCustomer }) => (isCustomer ? "black" : "white")};
  border-radius: 10px;
`;

const Message = ({ message, user }) => {
  const userName = user?.name || "";
  const isCustomer = user?.type === "customer";

  return (
    <MessageWrapper isCustomer={isCustomer}>
      <MessageAuthor>{userName}</MessageAuthor>
      <MessageText isCustomer={isCustomer}>{message.text}</MessageText>
    </MessageWrapper>
  );
};

export default Message;
