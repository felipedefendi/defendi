import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MessagesService } from '../messages/messages.service';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private logger: Logger = new Logger('EventsGateway');

  constructor(private readonly messagesService: MessagesService) {}

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('chat')
  async handleMessage(client: Socket, payload: { message: string }): Promise<void> {
    const newMessage = await this.messagesService.createMessage(client.id, payload.message);
    const messagePayload = { sender: client.id, content: newMessage.content, timestamp: newMessage.timestamp };
    this.server.emit('chat', messagePayload);
  }

  notifyUpdate(message: string) {
    this.server.emit('update', message);
  }
}
