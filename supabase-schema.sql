-- 🍲 粥底火锅 - 数据库建表
-- 在 Supabase SQL Editor 中运行这段 SQL

CREATE TABLE IF NOT EXISTS public.orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_no TEXT UNIQUE NOT NULL,        -- 订单号
  table_no INTEGER NOT NULL,            -- 桌号
  items JSONB NOT NULL DEFAULT '[]',    -- 菜品 [{name, price, qty, category}]
  total_amount DECIMAL(10, 2) NOT NULL, -- 总金额
  note TEXT DEFAULT '',                 -- 备注
  status TEXT DEFAULT 'pending',        -- pending | paid | completed | cancelled
  payment_method TEXT DEFAULT '',       -- wechat | alipay | cash
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

-- 索引 - 按状态查、按时间排序
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 行级安全
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 允许任何人下单
CREATE POLICY "客人可以下单" ON public.orders
  FOR INSERT WITH CHECK (true);

-- 所有人可查（Vercel Functions 用 service_role 管理）
CREATE POLICY "可读取订单" ON public.orders
  FOR SELECT USING (true);

CREATE POLICY "可更新订单" ON public.orders
  FOR UPDATE USING (true);
