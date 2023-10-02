import axios, { AxiosInstance } from 'axios';

class ChatBase {
  private client: AxiosInstance;
  constructor() {
    this.client = axios.create({
      baseURL: 'https://www.chatbase.co/api/v1',
      headers: {
        Authorization: `Bearer ${process.env.CHATBASE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
  }

  public async createChatBot(req: CreateChatBotRequest): Promise<any> {
    return this.client.post('/create-chatbot', req);
  }

  public async updateChatBot(req: UpdateChatBotRequest): Promise<any> {
    return this.client.post('/update-chatbot-data', req);
  }

  public async getChatBots(): Promise<any> {
    return this.client.get('/get-chatbots');
  }
}

interface CreateChatBotRequest {
  chatbotName: string;
  sourceText: string;
}

interface UpdateChatBotRequest extends CreateChatBotRequest {
  chatbotId: string;
}

export default new ChatBase();
