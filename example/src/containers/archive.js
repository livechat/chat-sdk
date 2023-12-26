import React, { useContext, useEffect } from "react";
import styled from "@emotion/styled";

import List from "../Components/Chat/List";
import Messages from "../Components/Chat/Messages";
import { ChatContext } from '../context/chat';

const Wrapper = styled.div`
  display: flex;
  height: calc(100% - 85px);
  min-height: 400px;
  padding: 1rem;
`;

const ArchivedChats = () => {
  const { getArchivedChats } = useContext(ChatContext)

  useEffect(() => {
    getArchivedChats()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Wrapper>
      <List />
      <Messages onlyMessages />
    </Wrapper>
  );
};

export default ArchivedChats;
