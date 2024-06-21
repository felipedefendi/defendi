"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const item_schema_1 = require("./schemas/item.schema");
const events_gateway_1 = require("../events/events.gateway");
const logs_service_1 = require("../logs/logs.service");
let ItemsService = class ItemsService {
    constructor(itemModel, eventsGateway, logsService) {
        this.itemModel = itemModel;
        this.eventsGateway = eventsGateway;
        this.logsService = logsService;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.itemModel.find().exec();
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.itemModel.findOne({ id }).exec();
            if (!item) {
                throw new common_1.NotFoundException(`Item with ID ${id} not found`);
            }
            return item;
        });
    }
    create(createItemDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const newItem = new this.itemModel(Object.assign({ id: this.generateUniqueId() }, createItemDto));
            yield newItem.save();
            this.eventsGateway.notifyUpdate(`Item with ID ${newItem.id} created`);
            yield this.logsService.createLog(`Item with ID ${newItem.id} created`);
            return newItem;
        });
    }
    update(id, updateItemDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingItem = yield this.findOne(id);
            if (!existingItem) {
                throw new common_1.NotFoundException(`Item with ID ${id} not found`);
            }
            Object.assign(existingItem, updateItemDto);
            yield existingItem.save();
            this.eventsGateway.notifyUpdate(`Item with ID ${id} updated`);
            yield this.logsService.createLog(`Item with ID ${id} updated`);
            return existingItem;
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.itemModel.deleteOne({ id }).exec();
            if (result.deletedCount === 0) {
                throw new common_1.NotFoundException(`Item with ID ${id} not found`);
            }
            this.eventsGateway.notifyUpdate(`Item with ID ${id} removed`);
            yield this.logsService.createLog(`Item with ID ${id} removed`);
        });
    }
    generateUniqueId() {
        return (Date.now() + Math.random()).toString(36);
    }
};
exports.ItemsService = ItemsService;
exports.ItemsService = ItemsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(item_schema_1.Item.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        events_gateway_1.EventsGateway,
        logs_service_1.LogsService])
], ItemsService);
