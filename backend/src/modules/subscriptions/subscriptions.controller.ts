import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../decorators/user.decorator';

@Controller('subscriptions')
@UseGuards(AuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(
    @User('id') userId: string,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.create(userId, createSubscriptionDto);
  }

  @Get()
  findAll(@User('id') userId: string) {
    return this.subscriptionsService.findAllByUser(userId);
  }

  @Get('upcoming')
  getUpcoming(@User('id') userId: string) {
    return this.subscriptionsService.getUpcomingRenewals(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User('id') userId: string) {
    return this.subscriptionsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(id, userId, updateSubscriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('id') userId: string) {
    return this.subscriptionsService.remove(id, userId);
  }
}

