import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from './schemas/item.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoggingInterceptor } from '../logger/logging.interceptor';
import { TimingInterceptor } from '../logger/timing.interceptor';

@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor, TimingInterceptor)
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @Post()
  async create(@Body() createItemDto: Omit<Item, 'id'>): Promise<Item> {
    return this.itemsService.create(createItemDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateItemDto: Partial<Item>): Promise<Item> {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.itemsService.remove(id);
  }
}
