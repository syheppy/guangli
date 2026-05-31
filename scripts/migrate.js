/**
 * 薯鲜生 — Supabase 一键建表 & 数据注入脚本
 *
 * 使用方式：
 *   node scripts/migrate.js
 *
 * 说明：
 *   Supabase 的 JS 客户端不支持直接执行 DDL（CREATE TABLE）。
 *   本脚本先尝试向 products 表写入数据；若表不存在，
 *   会在 Supabase 控制台 SQL Editor 中输出需要执行的建表 SQL。
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wiwigmrdddykgfawphtm.supabase.co'
const supabaseKey = 'sb_publishable_UEQ6GVeznIvZOneFgcYBlQ_sPwSstLh'
const supabase = createClient(supabaseUrl, supabaseKey)

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS products (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT        NOT NULL,
  category    TEXT        NOT NULL,
  price       NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock       INTEGER     NOT NULL DEFAULT 0,
  status      BOOLEAN     NOT NULL DEFAULT true,
  image_url   TEXT        DEFAULT '',
  description TEXT        DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 允许匿名/API Key 读写（根据你的 RLS 策略可调整）
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允许读取" ON products FOR SELECT USING (true);
CREATE POLICY "允许插入" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "允许更新" ON products FOR UPDATE USING (true);
CREATE POLICY "允许删除" ON products FOR DELETE USING (true);
`

const SEED_DATA = [
  {
    name: '湛江普薯32号',
    category: '生鲜农品',
    price: 29.9,
    stock: 128,
    status: true,
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAyT8aPC5rC5YPtdQFCkGy30ZyvxtS8hcM4RAYL6DsXk-krpQ28Ibh_6t6Lwz0RF89nC_qY0DgYA3OjT8a9Fp0QiGuwB8cky4mRUBttchCY_G1v1qYF-7vKFvb8IoaDmr3Xm2D6ofThkNxxtHxCoxp5MGhdfFLrgjqavv9R8oxHY_l5TmdiAIE43Pvmp_Japo_5iYlou3LgGnTFgdD8joNfsmbA6GANIsVxCY6P2nQpbSc9Ffrmg-e_iooHOQpsbFel3IPyt-LWj40',
    description:
      '湛江原产地直发的优质红薯，薯肉细腻、香甜软糯，是湛江本地最具代表性的鲜食薯品种之一。自然农法种植，当天现挖现发，锁住田间新鲜。',
  },
  {
    name: '冰淇淋紫薯',
    category: '生鲜农品',
    price: 35.0,
    stock: 5,
    status: true,
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDoMTAbMHr_dwUnGrbls1FT8z1BTHv_Rvcf_goKYlhIYjmS8aznxbl_MCJ26T0afC-O5yYNkddaoigBSVlqaHjSQDg-inuZARIcFxeRuagLVmwZvtZL5l3jkhuNQoAJqAew6XQpdrqYg7dKTaPLt-J7aiw3eMz1hjym8xZMJXbXngsTizuul7mArUciphhon1KbiUvIGHLZvAiq1ioMia0Dfd0NNol-Ej-hSIR5RJUN9yCaqe7-epqD8qnr4p4I6X6ewSW1NqUdIWE',
    description:
      '原生态高品质紫薯品种，口感极其粉糯、质地绵密致密。薯肉呈深紫色，入口沙化细腻，越嚼越香，是注重健康饮食人群的理想粗粮选择。自然生长、不催熟，保留作物本真风味。',
  },
  {
    name: '番番小芋蒲织挂件',
    category: '文创周边',
    price: 68.0,
    stock: 42,
    status: false,
    image_url:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4V2AUGMyVkrCGOfiwMA9itsMBHqTRFx9nb2dkh2qP0AD_quE2za_5jiXEohDcbQTjJGQNsuyu0Vx_bkbVJ_4XVcxTjDkoShtDn45guZXAhmmQHouXioHVv6IKD5-K5_CEzk4c98B6bpW0c-S6GbACpB9zU_I1v-B6zVzRhsFSr0Vg3kGcJCfUT_qAbnWu_VWoA4tZRk9aocgSoy67cIkfgh8ml44AhF8IsLCXwz2BuNfi2qC0MpSTlPEWCIdtqEyN-KUdRQDWkP0',
    description:
      '薯鲜生 IP「番番小芋」联名湛江非遗蒲织工艺手工挂件。IP 形象呈静态放松姿态，双手自然揣在肚子上，神态憨厚安详。每件均由湛江本地蒲织手艺人手工编织，天然蒲草材质，兼具装饰性与文化收藏价值。',
  },
]

async function main() {
  console.log('🍠 薯鲜生 — Supabase 数据迁移工具\n')
  console.log('📡 连接地址:', supabaseUrl)

  // Step 1: 检测 products 表是否已存在
  console.log('\n[1/3] 检测 products 表是否可用...')
  const { data: existing, error: checkError } = await supabase
    .from('products')
    .select('id')
    .limit(1)

  if (checkError) {
    console.error('\n❌ products 表尚不存在或无访问权限。')
    console.error('   错误信息:', checkError.message)
    console.log('\n📋 请前往 Supabase 控制台 → SQL Editor，执行以下建表 SQL：')
    console.log('─'.repeat(60))
    console.log(CREATE_TABLE_SQL)
    console.log('─'.repeat(60))
    console.log('\n建表完成后，重新运行本脚本即可注入种子数据。')
    process.exit(1)
  }

  console.log('   ✅ products 表已就绪')

  // Step 2: 清空旧数据（如有）
  if (existing && existing.length > 0) {
    console.log('\n[2/3] 清空已有旧数据...')
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0)
    if (deleteError) {
      console.error('   ⚠️ 清空失败:', deleteError.message)
    } else {
      console.log('   ✅ 旧数据已清空')
    }
  } else {
    console.log('\n[2/3] 表为空，跳过清空步骤')
  }

  // Step 3: 批量插入种子数据
  console.log('\n[3/3] 注入种子数据...')
  const { data: inserted, error: insertError } = await supabase
    .from('products')
    .insert(SEED_DATA)
    .select()

  if (insertError) {
    console.error('   ❌ 插入失败:', insertError.message)
    process.exit(1)
  }

  console.log(`   ✅ 成功插入 ${inserted.length} 条商品数据：`)
  inserted.forEach((row) => {
    console.log(`      · [${row.id}] ${row.name} — ¥${row.price} × ${row.stock}件`)
  })

  console.log('\n🎉 数据迁移完成！\n')
}

main()
