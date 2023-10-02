import express from 'express';

import { ICustomRequest } from '../utils';
import { handleError, route } from '../decorators';
import { Routable } from '../routes/routable';
import ChatBotConnector, { ChatBase } from '../handlers/chat-base';
import { Spec } from '../models';
import { log } from 'console';
// noinspection JSUnusedGlobalSymbols
export class ChatBotController extends Routable {
  constructor() {
    super('/chatbot');
  }

  @route('post', '/create')
  @handleError()
  async create(req: ICustomRequest): Promise<express.Response<unknown>> {
    const {
      resHandler: res,
      body: { specId, chatbotName, sourceText }
    } = req;

    const spec = await Spec.findOne({ spec_id: specId }).lean();

    log(spec);

    if (spec) {
      return res.ok({
        id: spec.chatbase_id,
        url: ChatBase.chatUrl(spec.chatbase_id)
      });
    }

    const chat = await ChatBotConnector.createChatBot(req.body);

    await Spec.create({
      spec_id: specId,
      title: chatbotName,
      chatbase_id: chat.chatbotId,
      description: sourceText
    });

    return res.ok(chat);
  }

  @route('post', '/update')
  @handleError()
  async update(req: ICustomRequest): Promise<express.Response<unknown>> {
    const { resHandler: res } = req;
    const response = await ChatBotConnector.updateChatBot(req.body);
    return res.ok(response?.data);
  }

  @route('post', '/update-settings/:id')
  @handleError()
  async updateSettings(
    req: ICustomRequest
  ): Promise<express.Response<unknown>> {
    const {
      resHandler: res,
      params: { id }
    } = req;
    const response = await ChatBotConnector.updateChatBotSetting(id);
    return res.ok(response);
  }

  @route('get', '/get-all')
  @handleError()
  async getAll(req: ICustomRequest): Promise<express.Response<unknown>> {
    const { resHandler: res } = req;
    const { data } = await ChatBotConnector.getChatBots();
    return res.ok(data);
  }

  @route('delete', '/:id')
  @handleError()
  async delete(req: ICustomRequest): Promise<express.Response<unknown>> {
    const {
      resHandler: res,
      params: { id }
    } = req;
    const { data } = await ChatBotConnector.delete(id);
    return res.ok(data);
  }
}
