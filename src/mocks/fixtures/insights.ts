/**
 * 洞察与结果 Mock Fixtures。
 *
 * 为已完成任务生成逼真的分析结果，含：
 *   - 数据字典（表结构、字段、关系）
 *   - 分析计划
 *   - Python 代码示例
 *   - 执行结果（含漏斗数据）
 *   - 洞察列表（含置信度、影响评估）
 *   - 策略建议
 */

import type {
  DataDictionary,
  Insight,
  Strategy,
  ExecutionResult,
  AnalysisResult,
} from '@/api/types'

// ─── 数据字典 ───

const demoDataDict: DataDictionary = {
  tables: [
    {
      name: 'orders',
      description: '订单表',
      row_count: 1_240_000,
      columns: [
        { name: 'order_id', data_type: 'bigint', is_nullable: false, description: '订单唯一 ID', is_key: true },
        { name: 'user_id', data_type: 'bigint', is_nullable: false, description: '用户 ID', is_key: true },
        { name: 'product_id', data_type: 'bigint', is_nullable: false, description: '商品 ID', is_key: false },
        { name: 'amount', data_type: 'decimal(10,2)', is_nullable: false, description: '订单金额', is_key: false },
        { name: 'status', data_type: 'varchar(32)', is_nullable: false, description: '订单状态', is_key: false },
        { name: 'created_at', data_type: 'timestamp', is_nullable: false, description: '下单时间', is_key: false },
      ],
    },
    {
      name: 'users',
      description: '用户表',
      row_count: 560_000,
      columns: [
        { name: 'user_id', data_type: 'bigint', is_nullable: false, description: '用户唯一 ID', is_key: true },
        { name: 'register_channel', data_type: 'varchar(64)', is_nullable: true, description: '注册渠道', is_key: false },
        { name: 'register_at', data_type: 'timestamp', is_nullable: false, description: '注册时间', is_key: false },
        { name: 'last_login_at', data_type: 'timestamp', is_nullable: true, description: '最近登录时间', is_key: false },
      ],
    },
    {
      name: 'events',
      description: '行为事件表',
      row_count: 8_500_000,
      columns: [
        { name: 'event_id', data_type: 'bigint', is_nullable: false, description: '事件 ID', is_key: true },
        { name: 'user_id', data_type: 'bigint', is_nullable: false, description: '用户 ID', is_key: true },
        { name: 'event_type', data_type: 'varchar(64)', is_nullable: false, description: '事件类型', is_key: false },
        { name: 'page_path', data_type: 'varchar(256)', is_nullable: true, description: '页面路径', is_key: false },
        { name: 'event_time', data_type: 'timestamp', is_nullable: false, description: '事件发生时间', is_key: false },
      ],
    },
  ],
  relations: [
    { from: 'orders.user_id', to: 'users.user_id', type: 'many_to_one' },
    { from: 'events.user_id', to: 'users.user_id', type: 'many_to_one' },
  ],
  key_fields: ['orders.order_id', 'users.user_id', 'events.event_id'],
  summary:
    '电商核心业务数据：用户→订单→行为事件三层结构，适合漏斗转化、留存、LTV 分析。',
}

// ─── 分析计划 ───

const demoAnalysisPlan = {
  objective: '识别用户从浏览到下单的转化漏斗中的关键流失节点',
  metrics: [
    { name: '页面浏览量 (PV)', description: '各关键页面访问次数' },
    { name: '独立访客 (UV)', description: '去重后的访问用户数' },
    { name: '转化率', description: '相邻步骤间的转化百分比' },
    { name: '平均停留时长', description: '用户在关键页面的平均停留时间' },
  ],
  steps: [
    { agent: 'Agent 1', name: '数据理解', description: '解析 orders/users/events 三表结构' },
    { agent: 'Agent 2', name: '策略设计', description: '定义漏斗步骤：首页→商品页→购物车→结算→支付成功' },
    { agent: 'Agent 3', name: '代码生成', description: '生成 SQL + Python 分析脚本' },
    { agent: 'Agent 4', name: '代码执行', description: '沙箱执行，输出各阶段转化数据' },
    { agent: 'Agent 5', name: '洞察生成', description: '从数据中提取业务洞察与策略建议' },
  ],
}

// ─── 代码示例 ───

const demoGeneratedCode = `import pandas as pd
import matplotlib.pyplot as plt

# 1. 读取漏斗各阶段数据
funnel_data = {
    '首页访问': 125_000,
    '商品详情页': 68_000,
    '加入购物车': 32_000,
    '进入结算': 18_000,
    '支付成功': 12_500,
}

# 2. 计算转化率
steps = list(funnel_data.keys())
values = list(funnel_data.values())
conversion_rates = [100] + [values[i] / values[i - 1] * 100 for i in range(1, len(values))]

# 3. 输出结果
for step, val, rate in zip(steps, values, conversion_rates):
    print(f"{step}: {val:,} ({rate:.1f}%)")

# 关键发现：商品页→购物车转化率仅 47%，是最大流失点
`

// ─── 执行结果 ───

const demoExecutionResult: ExecutionResult = {
  success: true,
  output: {
    funnel: {
      steps: ['首页访问', '商品详情页', '加入购物车', '进入结算', '支付成功'],
      values: [125_000, 68_000, 32_000, 18_000, 12_500],
      conversion_rates: [100, 54.4, 47.1, 56.3, 69.4],
    },
    top_dropoff: {
      step: '商品详情页 → 加入购物车',
      dropoff_count: 36_000,
      dropoff_rate: 52.9,
    },
    summary: '最大流失发生在商品详情页到购物车阶段，建议优化商品描述与推荐算法',
  },
  logs:
    '[2026-05-08T10:00:01Z] Agent 1: 开始数据理解\n' +
    '[2026-05-08T10:00:03Z] Agent 1: 发现 3 张表，56 个字段\n' +
    '[2026-05-08T10:00:08Z] Agent 2: 漏斗策略设计完成\n' +
    '[2026-05-08T10:00:12Z] Agent 3: SQL 生成完毕\n' +
    '[2026-05-08T10:00:15Z] Agent 4: 沙箱执行成功，耗时 2.3s\n' +
    '[2026-05-08T10:00:18Z] Agent 5: 洞察生成完成\n',
  error: null,
  duration_ms: 17_500,
}

// ─── 洞察列表 ───

const demoInsights: Insight[] = [
  {
    title: '购物车转化率偏低，商品详情页存在明显流失',
    description:
      '从商品详情页到购物车的转化率仅为 47.1%，意味着超过一半的用户在浏览商品后没有产生加购行为。对比行业平均水平（约 60%），存在约 13 个百分点的优化空间。',
    data_support: {
      current_rate: 0.471,
      industry_avg: 0.60,
      gap: 0.129,
      affected_users: 36_000,
    },
    impact: '若提升至行业平均水平，预计月 GMV 可增加 ¥180–240 万',
    confidence: 0.87,
  },
  {
    title: '结算到支付成功率较高，说明支付流程体验良好',
    description:
      '结算到支付成功转化率为 69.4%，高于行业均值 55%。用户一旦进入结算流程，放弃率较低，说明当前支付体验（支付方式、页面加载、错误提示）处于健康水平。',
    data_support: {
      current_rate: 0.694,
      industry_avg: 0.55,
      gap: 0.144,
    },
    impact: '保持当前体验即可，无需优先投入资源',
    confidence: 0.92,
  },
  {
    title: '首页到商品详情页转化率 54.4%，推荐位点击有提升空间',
    description:
      '首页流量充足（12.5 万 PV），但仅 54.4% 的用户点击进入商品详情页。分析显示推荐位 CTR 仅 3.2%，远低于头部电商平台 6–8% 的水平。',
    data_support: {
      current_rate: 0.544,
      recommendation_ctr: 0.032,
      benchmark_ctr: 0.07,
    },
    impact: '优化推荐算法后，预计整体 GMV 可提升 8–12%',
    confidence: 0.78,
  },
]

// ─── 策略建议 ───

const demoStrategies: Strategy[] = [
  {
    name: '商品详情页加购引导优化',
    target_segment: '浏览商品但未加购的用户',
    trigger_condition: '用户在商品详情页停留超过 15 秒且未加购',
    action: '弹出限时优惠券 + 相似商品对比浮层',
    expected_effect: '加购转化率提升 8–12 个百分点',
    risk_assessment: '优惠券成本需控制在 GMV 增量的 15% 以内',
    config: { coupon_value: 10, max_display: 1 },
  },
  {
    name: '首页个性化推荐升级',
    target_segment: '首页访客',
    trigger_condition: '每次首页刷新',
    action: '接入协同过滤 + 实时热度排序，替换现有规则引擎',
    expected_effect: '推荐位 CTR 从 3.2% 提升至 5.5%',
    risk_assessment: '算法冷启动期（1–2 周）可能出现推荐质量波动',
    config: { model: 'collaborative_filtering', retrain_interval_hours: 24 },
  },
]

// ─── 组装函数 ───

export function buildResultForTask(taskId: string): AnalysisResult {
  return {
    task_id: taskId,
    data_dict: demoDataDict,
    analysis_plan: demoAnalysisPlan,
    generated_code: demoGeneratedCode,
    execution_result: demoExecutionResult,
    insights: demoInsights,
    strategies: demoStrategies,
  }
}
