import React, { useContext } from "react";
import { NavigationContext } from "../context/navigation";
import { navigationItem } from "../constants";
import Chats from "../containers/chats";
import ArchivedChats from "../containers/archive";
import AgentDetails from "../containers/agentDetails";


const Router = () => {
  const { activeTab } = useContext(NavigationContext)

  switch (activeTab) {
    case navigationItem.chats:
      return <Chats />

    case navigationItem.archive:
      return <ArchivedChats />

    case navigationItem.agent:
      return <AgentDetails />

    default:
      return null
  }
};

export default Router;
