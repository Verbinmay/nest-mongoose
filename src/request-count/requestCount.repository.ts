import {
  RequestCount,
  RequestCountsModelType,
} from './entities/requestCount.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RequestCountRepository {
  constructor(
    @InjectModel(RequestCount.name)
    private RequestCountModel: RequestCountsModelType,
  ) {}

  async checkIpData(a: {
    ip: string;
    timeInSec: number;
    attempts: number;
    route: string;
  }) {
    const dateInMLS = Date.now() - a.timeInSec * 1000;
    const result: Array<RequestCount> = await this.RequestCountModel.find({
      ip: a.ip,
      route: a.route,
      data: { $gte: dateInMLS },
    });

    return result.length < a.attempts;
  }

  async addIpData(a: { ip: string; route: string }) {
    const newIpData = new RequestCount(a.ip, a.route);
    await this.RequestCountModel.create(newIpData);
    return true;
  }
}
