# 🍲 粥底火锅 · 扫码点餐系统

手机版点餐网站，客人扫码进入 → 选桌 → 点菜 → 提交订单 → 对接支付。

## 整体架构

```
用户手机                          Vercel (免费)                  Supabase (免费)
┌──────────┐    扫码       ┌──────────────────┐      ┌──────────────┐
│  浏览器   │ ─────────→  │ index.html (点餐) │      │  PostgreSQL  │
│          │              │ admin.html (管理) │      │  存储订单     │
│ 点餐下单  │ ←────────→ │ api/order.js (API)│ ←─→ │              │
└──────────┘              └──────────────────┘      └──────────────┘
```

**不需要买服务器**，Vercel + Supabase 免费额度足够小饭店使用。

---

## 部署步骤

### 第1步：部署到 Vercel（托管网站）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwangbaisen01-boop%2Fzhoudi-hotpot)

> 如果按钮点不了，复制这个链接打开：`https://vercel.com/new/clone?repository-url=https://github.com/wangbaisen01-boop/zhoudi-hotpot`

1. 点击按钮 → GitHub 登录 → **Import**
2. 项目名称保持 `zhoudi-hotpot`
3. 点 **Deploy** → 等 30 秒
4. 部署完成 → 得到 `https://zhoudi-hotpot.vercel.app` 链接 ✅

### 第2步：创建 Supabase 数据库（存订单）

1. 打开 [supabase.com](https://supabase.com) → 点 **Start your project**
2. 用 GitHub 登录 → **New project**
3. 填：
   - **Name**: `zhoudi-hotpot`
   - **Database Password**: 随便设一个（记下来）
   - **Region**: 选 **Singapore**（离中国近，速度快）
4. 点 **Create new project** → 等 2 分钟

### 第3步：创建订单表

1. 在 Supabase 项目里，左侧菜单点 **SQL Editor**
2. 点 **New query** → 粘贴以下 SQL → **Run**

```sql
CREATE TABLE IF NOT EXISTS public.orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_no TEXT UNIQUE NOT NULL,
  table_no INTEGER NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total_amount DECIMAL(10, 2) NOT NULL,
  note TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON public.orders
  FOR ALL USING (true) WITH CHECK (true);
```

### 第4步：获取密钥，配置 Vercel 环境变量

1. 在 Supabase → **Project Settings** → **API**

   | 变量名 | 去哪里找 |
   |--------|---------|
   | `SUPABASE_URL` | Project Settings → API → **Project URL**（类似 `https://xxx.supabase.co`） |
   | `SUPABASE_SERVICE_KEY` | Project Settings → API → **service_role key**（点 Reveal） |
   | `ADMIN_KEY` | **你自己设一个密码**，比如 `zhoudi888` |

2. 回 Vercel 项目页面 → **Settings** → **Environment Variables**
3. 添加上面 3 个变量，分别填对应的值
4. 点 **Deployments** → 找到最新的 deployment → 点 ** Redeploy**（让新变量生效）

### 第5步：打开管理后台

部署完成后打开 `https://你的链接/admin.html`

输入你设的 **ADMIN_KEY** 密码即可查看所有订单。

### 第6步：生成点餐二维码

1. 去 [草料二维码](https://cli.im/) 或百度搜"二维码生成器"
2. 粘贴你的 Vercel 链接（`https://zhoudi-hotpot.vercel.app`）
3. 生成二维码 → 打印出来贴到餐桌上

---

## 页面说明

| 页面 | 链接 | 说明 |
|------|------|------|
| 🏠 客人点餐 | `/` 或 `/index.html` | 扫码进来的默认页面 |
| 🔐 管理后台 | `/admin.html` | 查看订单、标记已付/完成 |
| 📡 API | `/api/order` | 后端接口，前端自动调用 |

## 管理后台功能

- 订单列表（桌号、菜品、金额、时间）
- 按状态筛选（待处理/已支付/已完成/已取消）
- 标记已支付 → 标记完成
- 统计数据（总订单数、待处理数、总金额）
- **新订单声音提醒** + 横幅通知

## 文件结构

```
zhoudi-hotpot/
├── index.html          # 客人点餐页面（首页/选桌/菜单/结账）
├── admin.html          # 老板管理后台
├── api/order.js        # Vercel Serverless API（订单增删改查）
├── vercel.json         # Vercel 部署配置
├── package.json        # 依赖（@supabase/supabase-js）
├── supabase-schema.sql # 数据库建表 SQL
└── README.md
```

## 后续计划

- [ ] 微信支付/支付宝对接（需要营业执照）
- [ ] 微信小程序版本
- [ ] 后厨打印小票自动接单
