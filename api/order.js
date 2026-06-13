const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 简单的管理员验证
  const adminKey = req.headers.authorization?.replace('Bearer ', '');
  const isAdmin = adminKey === process.env.ADMIN_KEY;

  try {
    // POST - 客人提交订单
    if (req.method === 'POST') {
      const { table_no, items, total_amount, note, payment_method } = req.body;

      if (!table_no || !items || !items.length) {
        return res.status(400).json({ error: '请选择桌号和菜品' });
      }

      const orderNo = 'ZD' + Date.now().toString(36).toUpperCase();

      const { data, error } = await supabase.from('orders').insert({
        order_no: orderNo,
        table_no,
        items,
        total_amount,
        note: note || '',
        status: 'pending',
        payment_method: payment_method || ''
      }).select().single();

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    // GET - 管理员查看订单
    if (req.method === 'GET') {
      if (!isAdmin) return res.status(401).json({ error: '未授权' });

      const { status: filterStatus, limit = 100 } = req.query;
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(Number(limit));

      if (filterStatus && filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }

    // PUT - 管理员更新订单状态
    if (req.method === 'PUT') {
      if (!isAdmin) return res.status(401).json({ error: '未授权' });

      const { id, status: newStatus } = req.body;
      if (!id || !newStatus) {
        return res.status(400).json({ error: '缺少参数' });
      }

      const updateData = { status: newStatus };
      if (newStatus === 'paid') updateData.paid_at = new Date().toISOString();

      const { data, error } = await supabase.from('orders').update(updateData).eq('id', id).select().single();

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    return res.status(405).json({ error: '不支持的请求方法' });

  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: '服务器错误，请稍后重试' });
  }
};
