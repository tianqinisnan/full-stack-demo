import { Request, Response } from 'express';
import { Event } from '../models/Event';

// 记录埋点事件
export const trackEvent = async (req: Request, res: Response) => {
  try {
    const events = Array.isArray(req.body) ? req.body : [req.body];
    
    // 使用 bulkWrite 来处理可能的重复项
    const operations = events.map(event => ({
      updateOne: {
        filter: { eventId: event.event_id },
        update: {
          $setOnInsert: {
            appId: event.app_id,
            eventType: event.event_type,
            eventId: event.event_id,
            deviceId: event.device_id,
            uniqueId: event.unique_id,
            timestamp: event.timestamp,
            platform: event.platform,
            attributes: event.attributes || {},
            deviceInfo: event.device_info || {},
            user: event.user || {}
          }
        },
        upsert: true
      }
    }));

    const result = await Event.bulkWrite(operations);

    res.status(200).json({
      success: true,
      message: '事件记录成功',
      result: {
        matched: result.matchedCount,
        modified: result.modifiedCount,
        upserted: result.upsertedCount
      }
    });
  } catch (error) {
    console.error('事件记录失败:', error);
    res.status(500).json({
      success: false,
      message: '事件记录失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
};

// 获取埋点事件列表
export const getEvents = async (req: Request, res: Response) => {
  try {
    const { appId, deviceId, startTime, endTime, eventType } = req.query;
    
    const query: any = {};
    
    if (appId) query.appId = appId;
    if (deviceId) query.deviceId = deviceId;
    if (eventType) query.eventType = eventType;
    if (startTime || endTime) {
      query.timestamp = {};
      if (startTime) query.timestamp.$gte = Number(startTime);
      if (endTime) query.timestamp.$lte = Number(endTime);
    }

    const events = await Event.find(query)
      .sort({ timestamp: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('获取事件失败:', error);
    res.status(500).json({
      success: false,
      message: '获取事件失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
}; 