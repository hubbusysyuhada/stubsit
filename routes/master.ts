import { FastifyPluginCallback } from "fastify";
import MasterController from "../controller/masterController";

const routes: FastifyPluginCallback = (fastify) => {
  fastify.get('/', MasterController.getAllEndpoints)
  fastify.post('/', MasterController.newEndpoint)
  fastify.get('/:endpoint', MasterController.getEndpointBySlug)
  fastify.put('/:endpoint', MasterController.editEndpoint)
  fastify.delete('/:endpoint', MasterController.deleteEndpoint)
  fastify.get('/:endpoint/:call', MasterController.getCallBySlug)
  fastify.put('/:endpoint/:call', MasterController.editCall)
}

export default routes