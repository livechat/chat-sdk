import React from "react";
import styled from "@emotion/styled";

const InstructionWrapper = styled.div`
  width: 100%;
  text-align: center;
  color: gray;
  margin-top: 20%;
`;

const ChatInstruction = () => (
  <InstructionWrapper>
    <h3 style={{ padding: "0 10%" }}>
      It looks like no one’s chatting. <br />
      Start a chat as Customer, and give the app a try.
    </h3>
    <p>
      1. Go to{" "}
      <a
        rel="noopener noreferrer"
        target="_blank"
        href="https://my.livechatinc.com/"
      >
        LiveChat
      </a>{" "}
      and log in.
    </p>
    <p>
      2. Go to{" "}
      <a
        rel="noopener noreferrer"
        target="_blank"
        href="https://my.livechatinc.com/settings/code"
      >
        Settings tab
      </a>
      .
    </p>
    <p>3. Click “Preview live” in the top right corner of the page. </p>
    <p>Enjoy chatting!</p>
  </InstructionWrapper>
);

export default ChatInstruction;
