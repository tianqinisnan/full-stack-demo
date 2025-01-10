import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  appId: string;
  eventType: string;
  eventId: string;
  deviceId: string;
  uniqueId: string;
  timestamp: number;
  platform: string;
  attributes: {
    url?: string;
    pageTitle?: string;
    env?: string;
    version?: string;
    source?: string;
    sessionId?: string;
    [key: string]: any;
  };
  deviceInfo: {
    platform: string;
    screenHeight?: number;
    screenWidth?: number;
    viewportHeight?: number;
    viewportWidth?: number;
    locale?: string;
    systemLanguage?: string;
    countryCode?: string;
    hostName?: string;
  };
  user?: {
    [key: string]: any;
  };
}

const EventSchema = new Schema({
  appId: { 
    type: String, 
    required: true,
    index: true 
  },
  eventType: { 
    type: String, 
    required: true,
    index: true 
  },
  eventId: { 
    type: String, 
    required: true,
    // unique: true 
  },
  deviceId: { 
    type: String, 
    required: true,
    index: true 
  },
  uniqueId: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Number, 
    required: true,
    index: true 
  },
  platform: { 
    type: String, 
    required: true 
  },
  attributes: {
    url: String,
    pageTitle: String,
    env: String,
    version: String,
    source: String,
    sessionId: String,
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  deviceInfo: {
    platform: { type: String, required: true },
    screenHeight: Number,
    screenWidth: Number,
    viewportHeight: Number,
    viewportWidth: Number,
    locale: String,
    systemLanguage: String,
    countryCode: String,
    hostName: String
  },
  user: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// 创建复合索引
EventSchema.index({ appId: 1, timestamp: -1 });
EventSchema.index({ appId: 1, deviceId: 1 });

export const Event = mongoose.model<IEvent>('Event', EventSchema); 