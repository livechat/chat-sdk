import React from "react";
import { Card } from "@livechat/design-system";

const FiledForm = ({ message }) => (
  <Card title="Prechat Survey">
    {message.fields.map(({ id, label, answer }) => (
      <p key={id}>
        <b>{label}</b> {answer}
      </p>
    ))}
  </Card>
);

export default FiledForm;
