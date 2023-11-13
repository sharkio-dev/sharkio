import { Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import { useLog } from "../lib/log";
import EndpointService from "../services/endpoint/endpoint.service";
import { SnifferService } from "../services/sniffer/sniffer.service";
import { IRouterConfig } from "./router.interface";
import OpenAI from "openai";
import { ChatService } from "../services/chat/chat.service";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

const defaultPrompt: any = [
  {
    role: "system",
    content: `
        You are a smart assistant for an api development tool called sharkio.
        Sharkio is an api proxy utilized as a developer tool.
        It has sniffer object that record requests and responses that are
        passed through them to the proxy.
      `,
  },
];

export class ChatController {
  private readonly openai: OpenAI;
  private readonly baseUrl: string = "/sharkio/chat";

  constructor(
    private readonly snifferManager: SnifferService,
    private readonly requestService: EndpointService,
    private readonly chatService: ChatService
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPEN_API_KEY,
    });
  }

  getRouter(): IRouterConfig {
    const router = PromiseRouter();

    router.route("/new").post(async (req: Request, res: Response) => {
      const userId = res.locals.auth.userId;
      const chat = await this.chatService.newChat(userId);

      res.json({ id: chat.id });
    });

    router.route("/firstMessage").post(async (req: Request, res: Response) => {
      const userId = res.locals.auth.userId;
      const { content } = req.body;
      const chat = await this.chatService.newChat(userId);

      await this.chatService.addMessage(userId, chat.id, content);

      const userMessage = { role: "user", content };
      const completion = await this.openai.chat.completions.create({
        messages: defaultPrompt,
        model: "gpt-3.5-turbo",
      });

      const completionMessage = completion.choices[0].message.content;

      if (completionMessage != null) {
        await this.chatService.addMessage(userId, chat.id, completionMessage);
        res.status(200).json({ message: completionMessage });
      } else {
        res.sendStatus(500);
      }
    });

    return { router, path: this.baseUrl };
  }
}
