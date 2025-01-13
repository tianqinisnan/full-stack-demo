/**
 * @fileoverview Mongoose 完整指南文档
 * 
 * ！！！注意！！！
 * 本文件仅作为 Mongoose 使用方法的参考文档。
 * 这些示例代码仅用于演示目的，不应直接在生产环境中使用。
 * 实际使用时请根据具体业务需求进行相应的错误处理和参数校验。
 * 
 * @example 本文件中的示例仅供参考，实际使用时需要：
 * 1. 添加适当的错误处理
 * 2. 添加参数类型检查
 * 3. 添加业务逻辑验证
 * 4. 考虑性能优化
 * 5. 添加适当的日志记录
 */

import mongoose, { Schema, Model, Document } from 'mongoose';

/**
 * 第一部分：Mongoose 核心概念
 */

/**
 * 1. Schema（模式）
 * @description Schema 是 Mongoose 的核心概念，用于定义集合的结构和属性
 */
const userSchemaExample = new Schema({
  // 基本字段定义
  firstName: { 
    type: String,
    required: true,
    trim: true
  },
  lastName: { 
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /\S+@\S+\.\S+/.test(v);
      },
      message: '邮箱格式不正确'
    }
  },
  status: {
    type: String,
    default: 'active'
  },
  phone: {
    type: String,
    index: true,
    unique: true
  }
}, {
  timestamps: true,
  versionKey: false
});

/**
 * 2. Middleware（中间件）
 * @description Mongoose 中间件用于在文档执行特定操作前后自动运行的函数
 */
userSchemaExample.pre('save', function(next) {
  console.log('保存前的处理');
  next();
});

userSchemaExample.post('save', function(doc) {
  console.log('保存后的处理');
});

/**
 * 3. Virtual（虚拟属性）
 * @description 虚拟属性是文档的属性，但不会保存到 MongoDB
 */
userSchemaExample.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

/**
 * 4. Instance Methods（实例方法）
 * @description 可以定义在文档实例上调用的方法
 */
interface IUserMethods {
  findSimilarTypes(): Promise<any>;
}

type UserModel = Model<typeof userSchemaExample, {}, IUserMethods>;

userSchemaExample.methods.findSimilarTypes = function() {
  return mongoose.model('User').find({ type: this.type });
};

/**
 * 5. Static Methods（静态方法）
 * @description 可以在模型上直接调用的方法
 */
userSchemaExample.statics.findByName = function(name: string) {
  return this.find({ name: new RegExp(name, 'i') });
};

/**
 * 6. Plugins（插件）
 * @description Mongoose 插件用于扩展 Schema 的功能
 */
const examplePlugin = (schema: Schema) => {
  schema.add({
    deletedAt: {
      type: Date,
      default: null
    }
  });

  schema.methods.softDelete = function() {
    this.deletedAt = new Date();
    return this.save();
  };
};

userSchemaExample.plugin(examplePlugin);

/**
 * 第二部分：Mongoose 常用操作示例
 */

/**
 * 1. 查询操作
 */
async function queryExamples() {
  const UserModel = mongoose.model('User', userSchemaExample);

  // find: 查询多条记录
  const activeUsers = await UserModel.find({ status: 'active' });
  
  // findOne: 查询单条记录
  const user = await UserModel.findOne({ phone: '13800138000' });
  
  // findById: 通过 ID 查询
  const userById = await UserModel.findById('123456789');
  
  // 链式调用示例
  const users = await UserModel.find({ status: 'active' })
    .select('phone firstName lastName')
    .sort({ createdAt: -1 })
    .limit(10)
    .skip(20);
}

/**
 * 2. 创建操作
 */
async function createExamples() {
  const UserModel = mongoose.model('User', userSchemaExample);

  // 创建单个文档
  const newUser = await UserModel.create({
    firstName: '张',
    lastName: '三',
    email: 'zhangsan@example.com',
    phone: '13800138000'
  });
  
  // 创建多个文档
  const users = await UserModel.create([
    { firstName: '李', lastName: '四', email: 'lisi@example.com', phone: '13800138001' },
    { firstName: '王', lastName: '五', email: 'wangwu@example.com', phone: '13800138002' }
  ]);
}

/**
 * 3. 更新操作
 */
async function updateExamples() {
  const UserModel = mongoose.model('User', userSchemaExample);

  // updateOne: 更新单个文档
  await UserModel.updateOne(
    { phone: '13800138000' },
    { status: 'blocked' }
  );
  
  // updateMany: 更新多个文档
  await UserModel.updateMany(
    { status: 'inactive' },
    { status: 'active' }
  );
  
  // findOneAndUpdate: 查找并更新
  const updatedUser = await UserModel.findOneAndUpdate(
    { phone: '13800138000' },
    { firstName: '新名字' },
    { new: true }
  );
}

/**
 * 4. 删除操作
 */
async function deleteExamples() {
  const UserModel = mongoose.model('User', userSchemaExample);

  // deleteOne: 删除单个文档
  await UserModel.deleteOne({ phone: '13800138000' });
  
  // deleteMany: 删除多个文档
  await UserModel.deleteMany({ status: 'inactive' });
  
  // findOneAndDelete: 查找并删除
  const deletedUser = await UserModel.findOneAndDelete({ phone: '13800138000' });
}

/**
 * 5. 高级功能示例
 */

// Bulk Operations（批量操作）示例
async function bulkOperationExamples() {
  const UserModel = mongoose.model('User', userSchemaExample);

  // bulkWrite: 执行批量操作
  await UserModel.bulkWrite([
    {
      insertOne: {
        document: { 
          firstName: '张',
          lastName: '三',
          email: 'zhangsan@example.com',
          phone: '13800138000'
        }
      }
    },
    {
      updateOne: {
        filter: { phone: '13800138001' },
        update: { status: 'blocked' }
      }
    },
    {
      deleteOne: {
        filter: { phone: '13800138002' }
      }
    },
    {
      replaceOne: {
        filter: { phone: '13800138003' },
        replacement: {
          firstName: '李',
          lastName: '四',
          email: 'lisi@example.com',
          phone: '13800138003'
        }
      }
    },
    {
      updateMany: {
        filter: { status: 'inactive' },
        update: { status: 'active' }
      }
    }
  ], {
    ordered: false // 设置为 false 时，即使某个操作失败，其他操作仍会继续执行
  });
}

// Population 示例
const blogPostSchema = new Schema({
  title: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

async function populationExample() {
  const BlogPost = mongoose.model('BlogPost', blogPostSchema);
  const post = await BlogPost.findOne().populate('author');
}

// 事务示例
async function transactionExample() {
  const UserModel = mongoose.model('User', userSchemaExample);
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    await UserModel.create([{ 
      firstName: '张',
      lastName: '三',
      email: 'zhangsan@example.com',
      phone: '13800138000'
    }], { session });
    
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

// 聚合示例
async function aggregateExample() {
  const UserModel = mongoose.model('User', userSchemaExample);
  
  const userStats = await UserModel.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
}

/**
 * 6. 其他常用方法
 */
async function otherExamples() {
  const UserModel = mongoose.model('User', userSchemaExample);

  // distinct: 获取指定字段的唯一值
  const uniqueStatuses = await UserModel.distinct('status');
  
  // countDocuments: 获取文档数量
  const activeUserCount = await UserModel.countDocuments({ status: 'active' });
  
  // exists: 检查是否存在
  const hasBlockedUsers = await UserModel.exists({ status: 'blocked' });
} 