import { useState, useMemo } from "react";
import { ChatSDK } from "../utils/chat-sdk";

export function useAgentDetails() {
  const [agentDetails, setAgentDetails] = useState(null);

  useMemo(() => {
    const getAgent = async () => {
      try {
        const agent = await ChatSDK.getAgentDetails()

        setAgentDetails(agent)
      } catch (error) {
        console.warn('Cannot fetch information about logged in agent: ', error)
      }
    }

    getAgent()
  }, []);

  return { agentDetails };
}
