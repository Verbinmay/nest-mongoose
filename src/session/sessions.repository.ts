import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

import { Session, SessionModelType } from './entities/session.entity';

@Injectable()
export class SessionRepository {
  constructor(
    @InjectModel(Session.name)
    private SessionModel: SessionModelType,
  ) {}

  async findSessionsByUserId(userId: string) {
    return await this.SessionModel.find({ userId: userId });
  }

  async checkRefreshTokenEqual(a: {
    iat: number;
    deviceId: string;
    userId: string;
  }) {
    try {
      const result: Session | null = await this.SessionModel.findOne({
        lastActiveDate: new Date(a.iat * 1000).toISOString(),
        deviceId: a.deviceId,
        userId: a.userId,
      });
      return result != null;
    } catch (error) {
      return false;
    }
  }

  async deleteAll(a: { userId: string; deviceId: string }) {
    await this.SessionModel.deleteMany({
      userId: a.userId,
      deviceId: { $ne: a.deviceId },
    });
    return true;
  }

  async findSessionByDeviceId(deviceId: string) {
    const result: Session | null = await this.SessionModel.findOne({
      deviceId: deviceId,
    });
    return result;
  }

  async deleteSessionsByDeviceId(deviceId: string) {
    const result = await this.SessionModel.deleteOne({
      deviceId: deviceId,
    });
    return result.deletedCount === 1;
  }

  async save(session: Session) {
    const sessionModel = new this.SessionModel(session);
    return sessionModel.save();
  }

  async findSessionByDeviceIdAndUserId(deviceId: string, userId: string) {
    try {
      const result = await this.SessionModel.findOne({
        deviceId: deviceId,
        userId: userId,
      });
      return result;
    } catch (error) {
      return null;
    }
  }

  async deleteSessionLogout(a: { userId: string; deviceId: string }) {
    const result = await this.SessionModel.deleteOne({
      userId: a.userId,
      deviceId: a.deviceId,
    });
    return result.deletedCount === 1;
  }
}