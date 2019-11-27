import React from "react";
import { Card } from "@livechat/design-system";

const FilledForm = ({ message }) => (
  <Card title="Survey">
    {message.fields.map(({ id, label, answer, type }) => (
      <p key={id}>
        {type === "radio" ? (
          <span>
            <b>{label} </b> {answer.label}{" "}
          </span>
        ) : (
          <span>
            <b>{label}</b> {answer}
          </span>
        )}
      </p>
    ))}
  </Card>
);

export default FilledForm;
