const {
    InteractionResponseType,
    InteractionType,
    verifyKey,
  } = require("discord-interactions");
  const getRawBody = require("raw-body");
  
  const HI_COMMAND = {
    name: "Hi",
    description: "Say hello!",
  };
  /**
   * My function
   * @param {VercelRequest} request
   * @param {VercelResponse} response
   */
  module.exports = async (request, response) => {
    if (request.method === "POST") {
      const signature = request.headers["x-signature-ed25519"];
      const timestamp = request.headers["x-signature-timestamp"];
      const rawBody = await getRawBody(request);
  
      const isValidRequest = verifyKey(
        rawBody,
        signature,
        timestamp,
        process.env.PUBLIC_KEY
      );
  
      if (!isValidRequest) {
        console.error("Invalid Request");
        return response.status(401).send({ error: "Bad request signature " });
      }
  
      const message = request.body;

      if (message.type === InteractionType.PING) {
        console.log("Handling Ping request");
        response.send({
          type: InteractionResponseType.PONG,
        });
      } else if (message.type === InteractionType.APPLICATION_COMMAND) {
        switch (message.data.name.toLowerCase()) {
          case HI_COMMAND.name.toLowerCase():
            response.status(200).send({
              type: 4,
              data: {
                content: "Hello!",
              },
            });
            console.log("Slap Request");
            break;
          default:
            console.error("Unknown Command");
            response.status(400).send({ error: "Unknown Type" });
            break;
        }
      } else {
        console.error("Unknown Type");
        response.status(400).send({ error: "Unknown Type" });
      }
    }
  };
  