import React, { useContext } from "react";
import styled from "@emotion/styled";
import Loader from "../components/Loader";
import { ChatContext } from '../context/chat';

const Wrapper = styled.div`
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50%;
`;

const ImageWrapper = styled.div`
  margin-right: 2.5rem;
  
  & > img {
    border-radius: 50%;
    width: 200px;
    height: 200px;
  }
`;

const Text = styled.p`
  margin: 5px 0px;
`;

const AgentDetails = () => {
  const { agentDetails } = useContext(ChatContext)

  if (!agentDetails) return <Loader />;

  const { name, avatar, email, permission } = agentDetails.my_profile;
  const { id, plan } = agentDetails.license;

  return (
    <Wrapper>
      <ImageWrapper>
        <img alt="agent avatar" src={avatar} />
      </ImageWrapper>

      <div>
        <Text>
          <b>Name:</b> {name}
        </Text>
        <Text>
          <b>Email:</b> {email}
        </Text>
        <Text>
          <b>Role:</b> {permission}
        </Text>
        <Text>
          <b>License ID:</b> {id}
        </Text>
        <Text>
          <b>License plan:</b> {plan}
        </Text>
      </div>
    </Wrapper>
  );
};

export default AgentDetails;
