import express from 'express';

import { ICustomRequest } from '../utils';
import { handleError, route } from '../decorators';
import { Routable } from '../routes/routable';
import ChatBotConnector from '../handlers/chat-base';
// noinspection JSUnusedGlobalSymbols
export class StatusController extends Routable {
  constructor() {
    super('/status');
  }
  /**
   * @desc get status server
   * @access Public
   */
  @route('get', '/')
  @handleError()
  async show(req: ICustomRequest): Promise<express.Response<unknown>> {
    const { resHandler: res } = req;
    return res.ok();
  }
}
