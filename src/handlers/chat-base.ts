import axios, { AxiosInstance } from 'axios';

export class ChatBase {
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

  static chatUrl = (id) => `https://www.chatbase.co/chatbot-iframe/${id}`;

  public async createChatBot(req: CreateChatBotRequest): Promise<any> {
    const {
      data: { chatbotId }
    } = await this.client.post('/create-chatbot', req);

    // {
    //   chatbotId,
    //   instructions: 'I want you to act as a Product Manager',
    //   visibility: 'can_be_embedded',
    //   domains: [],
    //   initialMessages: ['Hi! What can I help you with?'],
    //   suggestedMessages: ['Hi! What are you?'],
    //   notifications_settings: {},
    //   settings: {
    //     model: 'gpt-3-turbo',
    //     styles: {
    //       theme: 'dark',
    //       userMessageColor: '#3B81F7',
    //       buttonColor: '#3B81F7',
    //       displayName: req.chatbotName,
    //       alignChatButton: 'right'
    //     },
    //     ip_limit: 20,
    //     ip_limit_timeframe: 240,
    //     ip_limit_message: 'Too many messages in a row',
    //     custom_domains: []
    //   }

    // await this.client.post('/update-chatbot-settings', {
    //   collectCustomerInformation: {
    //     name: { label: 'Name', active: true },
    //     email: { label: 'Email', active: true },
    //     title: 'Let us know how to contact you'
    //   },
    //   styles: {
    //     theme: 'dark',
    //     userMessageColor: '#3B81F7',
    //     buttonColor: '#3B81F7',
    //     displayName: 'Product Hunt',
    //     autoOpenChatWindowAfter: 4,
    //     alignChatButton: 'left'
    //   },
    //   chatbotId,
    //   name: 'my Chatbot',
    //   instructions:
    //     'I want you to act as a document that I am having a conversation with. Your name is "AI Assistant". You will provide me with answers from the given info. If the answer is not included, say exactly "Hmm, I am not sure." and stop after that. Refuse to answer any question not about the info. Never break character.',
    //   initialMessages: ['Hi! What can I help you with?'],
    //   suggestedMessages: ['Hi! What are you?'],
    //   visibility: 'can_be_embedded',
    //   onlyAllowOnAddedDomains: true,
    //   domains: ['example.com'],
    //   ipLimit: 20,
    //   ipLimitTimeframe: 240,
    //   ipLimitMessage: 'Too many messages in a row',
    //   model: 'gpt-4',
    //   temp: 0
    // });

    return { url: ChatBase.chatUrl(chatbotId), chatbotId };
  }

  public async updateChatBotSetting(id: string): Promise<any> {
    const settings = {
      chatbotId: id,
      visibility: 'can_be_embedded',
      domains: [],
      // custom_domains: ['exemple.com'],
      instructions:
        'I want you to act as a document that I am having a conversation with. Your name is "AI Assistant". You will provide me with answers from the given info. If the answer is not included, say exactly "Hmm, I am not sure." and stop after that. Refuse to answer any question not about the info. Never break character.',
      initialMessages: ['Hi! What can I help you with?'],
      suggestedMessages: ['Hi! What are you?'],
      ipLimit: 20,
      ipLimitTimeframe: 240,
      ipLimitMessage: 'Too many messages in a row',
      notifications_settings: {
        daily_leads_collected: {
          active: false,
          emails: []
        },
        daily_conversations: {
          active: false,
          emails: []
        }
      }
    };
    return this.client.post('/update-chatbot-settings', settings);
  }

  public async updateChatBot(req: UpdateChatBotRequest): Promise<any> {
    return this.client.post('/update-chatbot-data', req);
  }

  public async getChatBots(): Promise<any> {
    return this.client.get('/get-chatbots');
  }

  public async fetchLinks(): Promise<any> {
    return this.client.get('/fetch-links');
  }

  public async delete(id): Promise<any> {
    return this.client.delete('/delete-chatbot', { params: { chatbotId: id } });
  }
}

interface CreateChatBotRequest {
  chatbotName: string;
  sourceText: string;
}

interface UpdateChatBotRequest extends CreateChatBotRequest {
  chatbotId: string;
}

interface ChatbotBodyParams {
  chatbotId: string; // The unique ID for the chatbot (required)
  name?: string; // The name of the chatbot
  instructions?: string; // Instructions for the chatbot
  initialMessages?: string[]; // Array of initial messages to be used by the chatbot

  suggestedMessages?: string[]; // Array of suggested messages to be used by the chatbot
  visibility: 'private' | 'can_be_embedded'; // Visibility status of the chatbot
  onlyAllowOnAddedDomains?: boolean; // Enable or disable allowing the iframe and widget on specific domains
  domains?: string[]; // Array of allowed domains for the chatbot

  ipLimit?: number; // The limit on the number of messages to be sent from one device every ipLimitTimeframe seconds
  ipLimitTimeframe?: number; // The timeframe (in seconds) in which the messages limit is applied
  ipLimitMessage?: string; // The message to be displayed when the IP limit is exceeded
  model: 'gpt-4' | 'gpt-3.5-turbo'; // The AI model used by the chatbot

  temp?: number; // The temperature parameter for the AI model with a range of [0, 1]
  collectCustomerInformation?: {
    title: string; // Title for the customer contact details
    name: {
      email: {
        phone: any; // Placeholder for the phone object
      };
    };
  };

  styles?: {
    theme: 'dark' | 'light'; // The theme of the chatbot interface
    userMessageColor: string; // The color of the user message in Hex format (e.g., #3B81F7)
    buttonColor: string; // The color of the chat bubble button widget in Hex format (e.g., #3B81F7)
    displayName: string; // The display name of the chatbot
    autoOpenChatWindowAfter?: number; // The time (in seconds) after which the chatbot window will be automatically opened
    alignChatButton: 'left' | 'right'; // The alignment of the chatbot button ('left' | 'right')
  };
}

export default new ChatBase();
