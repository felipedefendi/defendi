import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './schemas/log.schema';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async createLog(message: string): Promise<Log> {
    const newLog = new this.logModel({ message, timestamp: new Date() });
    return newLog.save();
  }
}
