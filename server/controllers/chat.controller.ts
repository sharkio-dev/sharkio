import { Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { useLog } from "../lib/log";
import { ChatService } from "../services/chat/chat.service";
import EndpointService from "../services/endpoint/endpoint.service";
import { SnifferService } from "../services/sniffer/sniffer.service";
import { IRouterConfig } from "./router.interface";

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
      apiKey: process.env.OPEN_API_KEY ?? "",
    });
  }

  getRouter(): IRouterConfig {
    const router = PromiseRouter();

    router.route("").post(async (req: Request, res: Response) => {
      const userId = res.locals.auth.userId;
      const { content } = req.body;
      const chat = await this.chatService.newChat(userId);

      await this.chatService.addUserMessage(userId, chat.id, content);

      const userMessage = { role: "user", content };
      const completion = await this.openai.chat.completions.create({
        messages: [...defaultPrompt, userMessage],
        model: "gpt-3.5-turbo",
      });

      const completionMessage = completion.choices[0].message.content;

      if (completionMessage != null) {
        await this.chatService.addSystemMessage(
          userId,
          chat.id,
          completionMessage
        );
        res.status(200).json({ chatId: chat.id, content: completionMessage });
      } else {
        res.sendStatus(500);
      }
    });

    router
      .route("/:chatId/message")
      .post(async (req: Request, res: Response) => {
        const userId = res.locals.auth.userId;
        const { chatId } = req.params;
        const { content } = req.body;

        const messages = await this.chatService.loadMessagesByChatId(
          chatId as string
        );
        await this.chatService.addUserMessage(userId, chatId, content);

        const userMessage: ChatCompletionMessageParam = {
          role: "user",
          content,
        };

        const completion = await this.openai.chat.completions.create({
          messages: [...messages, userMessage],
          model: "gpt-3.5-turbo",
        });

        const completionMessage = completion.choices[0].message.content;

        if (completionMessage != null) {
          await this.chatService.addSystemMessage(
            userId,
            chatId,
            completionMessage
          );
          res.status(200).json({ chatId, content: completionMessage });
        } else {
          res.sendStatus(500);
        }
      })
      .get(async (req: Request, res: Response) => {});

    return { router, path: this.baseUrl };
  }
}
