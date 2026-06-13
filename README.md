# 🍲 粥底火锅 · 扫码点餐系统

手机版点餐网站，客人扫码进入，浏览菜品、加购下单、在线支付。

## 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwangbaisen01-boop%2Fzhoudi-hotpot)

点击上面按钮 → 用 GitHub 登录 → 点 Deploy → 部署完成！

部署后你会得到一个 `https://zhoudi-hotpot.vercel.app` 类似的链接。

### 步骤

1. 点上面的 **Deploy** 按钮
2. 用 GitHub 账号登录 Vercel（没有就注册一个，免费的）
3. 项目名称保持 `zhoudi-hotpot` 就行
4. 点 **Deploy**，等30秒
5. 部署完成！生成一个 `.vercel.app` 结尾的链接

### 生成点餐二维码

1. 去 [草料二维码](https://cli.im/) 或百度搜"二维码生成器"
2. 粘贴你的 Vercel 链接
3. 生成二维码 → 打印出来贴到餐桌上

## 页面结构

| 页面 | 功能 |
|------|------|
| 品牌首页 | 粥底火锅品牌展示，开始点餐入口 |
| 选桌号 | 选择桌号后进入菜单 |
| 菜单浏览 | 9个分类、30+菜品，加入购物车 |
| 确认订单 | 桌号、备注、订单明细 |
| 支付 | 微信支付/支付宝 |
| 下单成功 | 订单详情，可继续加菜 |

## 技术栈

纯 HTML + CSS + JS 静态网站，部署在 Vercel，国内可正常访问。
