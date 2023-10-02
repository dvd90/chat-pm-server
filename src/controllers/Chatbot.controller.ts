import express from 'express';

import { ICustomRequest } from '../utils';
import { handleError, route } from '../decorators';
import { Routable } from '../routes/routable';
import ChatBotConnector from '../handlers/chat-base';
// noinspection JSUnusedGlobalSymbols
export class ChatBotController extends Routable {
  constructor() {
    super('/chatbot');
  }

  @route('post', '/create')
  @handleError()
  async create(req: ICustomRequest): Promise<express.Response<unknown>> {
    const { resHandler: res } = req;
    const { data } = await ChatBotConnector.createChatBot(req.body);

    return res.ok(response?.data);
  }

  @route('post', '/update')
  @handleError()
  async update(req: ICustomRequest): Promise<express.Response<unknown>> {
    const { resHandler: res } = req;
    const response = await ChatBotConnector.updateChatBot(req.body);
    return res.ok(response?.data);
  }

  @route('get', '/get-all')
  @handleError()
  async getAll(req: ICustomRequest): Promise<express.Response<unknown>> {
    const { resHandler: res } = req;
    const response = await ChatBotConnector.getChatBots();
    return res.ok(response?.data);
  }
}
