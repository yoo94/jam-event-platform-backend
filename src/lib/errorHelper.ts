import { FastifyReply } from 'fastify';

export function handleError(reply: FastifyReply, errorType: {success:boolean, status:number, message:string}, error?: any) {
    reply.log.error(error);
    reply.status(errorType.status).send(errorType);
}