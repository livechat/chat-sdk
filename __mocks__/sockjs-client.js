export default jest.fn().mockImplementation(() => {
  const mitt = require("@livechat/mitt");
  const emitter = mitt();

  const addEventListener = (type, func) => {
    // Fake onOpen event call
    if (type === "open") func();

    emitter.on(type, func);
  };

  const removeEventListener = (type, func) => {
    emitter.off(type, func);
  };

  const close = () => {
    emitter.emit("close");
    emitter.off();
  };

  const send = payload => {
    const parsedPayload = JSON.parse(payload);
    const action = parsedPayload.action;
    const data = JSON.stringify({ action, success: true, payload: parsedPayload })

    emitter.emit("message", { data });
  };

  return {
    addEventListener,
    removeEventListener,
    close,
    send
  };
});
