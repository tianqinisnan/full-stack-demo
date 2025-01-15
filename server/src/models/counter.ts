import { Schema, model } from 'mongoose';

interface ICounter {
  _id: string;  // 格式: collection_name.field_name
  seq: number;
}

const counterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

export const Counter = model<ICounter>('Counter', counterSchema);

// 获取下一个序列号
export async function getNextSequence(name: string): Promise<number> {
  const result = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return result.seq;
} 