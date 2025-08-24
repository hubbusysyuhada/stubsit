import { FastifyPluginCallback } from 'fastify';
import MasterController from '../controller/masterController';

const routes: FastifyPluginCallback = (fastify) => {
  fastify.get('/', MasterController.getAllGroups);
  fastify.post('/', MasterController.newGroup);
  fastify.get('/:group', MasterController.getGroupBySlug);
  fastify.post('/:group', MasterController.newEndpoint);
  fastify.put('/:group', MasterController.editGroup);
  fastify.delete('/:group', MasterController.deleteGroup);
  fastify.get('/:group/:endpoint', MasterController.getEndpointBySlug);
  fastify.put('/:group/:endpoint', MasterController.editEndpoint);
  fastify.delete('/:group/:endpoint', MasterController.deleteEndpoint);
  fastify.get('/:group/:endpoint/:call', MasterController.getCallBySlug);
  fastify.put('/:group/:endpoint/:call', MasterController.editCall);
};

export default routes;
