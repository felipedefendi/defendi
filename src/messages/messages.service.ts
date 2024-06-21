import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MessagesService {
  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) {}

  async createMessage(sender: string, content: string): Promise<Message> {
    const newMessage = new this.messageModel({ sender, content, timestamp: new Date() });
    return newMessage.save();
  }
}
