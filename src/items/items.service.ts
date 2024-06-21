import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from './schemas/item.schema';
import { EventsGateway } from '../events/events.gateway';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    private eventsGateway: EventsGateway,
    private logsService: LogsService,
  ) {}

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemModel.findOne({ id }).exec();
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  async create(createItemDto: Omit<Item, 'id'>): Promise<Item> {
    const newItem = new this.itemModel({
      id: this.generateUniqueId(),
      ...createItemDto
    });
    await newItem.save();
    this.eventsGateway.notifyUpdate(`Item with ID ${newItem.id} created`);
    await this.logsService.createLog(`Item with ID ${newItem.id} created`);
    return newItem;
  }

  async update(id: string, updateItemDto: Partial<Item>): Promise<Item> {
    const existingItem = await this.findOne(id);
    if (!existingItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    Object.assign(existingItem, updateItemDto);
    await existingItem.save();
    this.eventsGateway.notifyUpdate(`Item with ID ${id} updated`);
    await this.logsService.createLog(`Item with ID ${id} updated`);
    return existingItem;
  }

  async remove(id: string): Promise<void> {
    const result = await this.itemModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    this.eventsGateway.notifyUpdate(`Item with ID ${id} removed`);
    await this.logsService.createLog(`Item with ID ${id} removed`);
  }

  private generateUniqueId(): string {
    return (Date.now() + Math.random()).toString(36);
  }
}
