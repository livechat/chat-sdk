import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "@livechat/design-system";
import Loader from "../Components/Loader";
import { ChatSDK } from "../Logic";
import { useAuth } from "../Logic/authorization";

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
    width: 200px;
    height: 200px;
  }
`;

const DetailsWrapper = styled.div`
  margin-top: 2em;
`;

const Text = styled.p`
  margin: 5px 0px;
`;

const AgentDetails = () => {
  const { instance } = useAuth();
  const [agentDetails, setAgentDetails] = useState(null);

  useEffect(() => {
    let isMounted = true;

    ChatSDK.getAgentDetails().then(details => {
      if (isMounted) {
        setAgentDetails(details);
      }
    });

    return () => isMounted = false;
  }, [setAgentDetails]);

  const signOut = () => {
    if (instance) {
      instance.signOut(() => {
        window.location.reload();
      });
    }
  };

  if (!agentDetails) return <Loader />;

  const { name, avatar, email, permission } = agentDetails.my_profile;
  const { id, plan } = agentDetails.license;

  return (
    <Wrapper>
      <ImageWrapper>
        <img alt="agent avatar" src={avatar} />
      </ImageWrapper>

      <DetailsWrapper>
        <h4>Agent details:</h4>
        <Text>
          <b>Name:</b> {name}
        </Text>
        <Text>
          <b>Email:</b> {email}
        </Text>
        <Text>
          <b>Role:</b> {permission}
        </Text>

        <h4>License:</h4>
        <Text>
          <b>ID:</b> {id}
        </Text>
        <Text>
          <b>Plan:</b> {plan}
        </Text>

        <Button style={{ marginTop: "1rem" }} destructive onClick={signOut}>
          Logout
        </Button>
      </DetailsWrapper>
    </Wrapper>
  );
};

export default AgentDetails;
