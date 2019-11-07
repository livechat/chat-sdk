import React from "react";
import { TabsWrapper, TabsList, Tab } from "@livechat/design-system";
import styled from "styled-components";

const TabItem = styled(Tab)`
  margin-top: 0.5rem;
  padding: 0.5rem 1.5rem;
`;

const LiveChatLogo = styled.a`
  margin-left: auto;

  & > img {
    height: 25px;
    margin-right: 2.5rem;
    margin-top: 13px;
  }
`;

const Navigation = ({ navigationItems, selectTab, activeTab }) => (
  <TabsWrapper>
    <TabsList style={{ paddingLeft: "1rem" }}>
      {navigationItems.map(item => (
        <TabItem
          key={item.id}
          onClick={() => selectTab(item.id)}
          isSelected={item.id === activeTab.id}
          description={(item && item.count) || null}
        >
          {item.title}
        </TabItem>
      ))}
      
      <LiveChatLogo
        href="https://livechatinc.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          alt="LiveChat logo"
          src="https://rapportboost.ai/wp-content/uploads/2016/12/livechat_384x212.png"
        />
      </LiveChatLogo>
    </TabsList>
  </TabsWrapper>
);

export default Navigation;
