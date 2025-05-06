import { FastifyPluginCallback } from "fastify";
import ProxyController from "../controller/proxyController";

const routes: FastifyPluginCallback = (fastify) => {
  fastify.all('/:endpoint/:call', ProxyController.run)
}

export default routes