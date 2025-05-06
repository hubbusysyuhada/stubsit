import { FastifyPluginCallback } from "fastify";
import MasterController from "../controller/masterController";

const routes: FastifyPluginCallback = (fastify) => {
  fastify.get('/', MasterController.getAllEndpoints)
  fastify.post('/', MasterController.newEndpoint)
  fastify.get('/:endpoint', MasterController.getEndpointBySlug)
  fastify.put('/:endpoint', MasterController.editEndpoint)
  fastify.delete('/:endpoint', MasterController.deleteEndpoint)
  fastify.post('/:endpoint', MasterController.newCall)
  fastify.put('/:endpoint/:call', MasterController.editCall)
  fastify.delete('/:endpoint/:call', MasterController.deleteCall)
}

export default routes