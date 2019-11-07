import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";

// LOGIC:
import { ChatSDK } from "./Logic";
import { useAuth } from "./Logic/authorization";

// COMPONENTS:
import ActiveChats from "./Container/ActiveChats";
import AgentDetails from "./Container/AgentDetails";
import Archives from "./Container/Archives";
import Navigation from "./Components/Navigation";

// STYLED COMPONENTS:
const AppWrapper = styled.div`
  background: ${({ theme }) => theme.bgGray};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

const Wrapper = styled.div`
  width: 95%;
  max-width: 1000px;
  height: 100vh;
  max-height: 700px;
  background: ${({ theme }) => theme.bgWhite};
  box-sizing: border-box;
  border-radius: 10px;
  border: 2px solid ${({ theme }) => theme.secondary};
  box-shadow: 0px 0px 15px 0px rgba(51, 51, 51, 0.1);
`;

// CONSTANTS:
const theme = {
  bgWhite: "#FFFFFF",
  bgGray: "#F0F4F7",
  primary: "#4083F3",
  secondary: "#DDE2E6",
};

const navigationItems = [
  { id: "chats", title: "Active chats", component: ActiveChats },
  { id: "archive", title: "Archive", component: Archives },
  { id: "agent", title: "Agent details", component: AgentDetails }
];

const App = () => {
  const { isLoggedIn, agentData } = useAuth();
  const [activeTab, setActiveTab] = useState(navigationItems[0]);

  const selectActiveTab = tabId => {
    const pickedTab = navigationItems.find(({ id }) => id === tabId);
    setActiveTab(pickedTab);
  };

  useEffect(() => {
    if (isLoggedIn && agentData) {
      ChatSDK.init(agentData);
      return ChatSDK.destroy;
    }
  }, [agentData, isLoggedIn]);

  const ActiveComponent = activeTab && activeTab.component;

  return (
    <ThemeProvider theme={theme}>
      <AppWrapper>
        <Wrapper>
          <Navigation
            navigationItems={navigationItems}
            selectTab={selectActiveTab}
            activeTab={activeTab}
          />

          {activeTab && <ActiveComponent />}
        </Wrapper>
      </AppWrapper>
    </ThemeProvider>
  );
};

export default App;
