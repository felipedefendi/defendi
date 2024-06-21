import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { Item, ItemSchema } from './schemas/item.schema';
import { EventsModule } from '../events/events.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    EventsModule,
    LogsModule, // Adicionar o LogsModule aqui
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
