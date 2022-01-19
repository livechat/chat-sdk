import React from "react";
import { Card } from "@livechat/design-system";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  margin-bottom: 2rem;
`;

const Answer = styled.p`
  margin: 3px 0;
`

const FilledForm = ({ message }) => (
  <Wrapper>
    <Card title="Survey:">
      {message.fields.map(({ id, label, answer }) => (
        <Answer key={id}>
          <b>{label}</b> {answer?.label || answer}
        </Answer>
      ))}
    </Card>
  </Wrapper>
);

export default FilledForm;
