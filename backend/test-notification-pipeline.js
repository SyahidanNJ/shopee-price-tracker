// Integration test: membuktikan logika duplicate-prevention & cooldown
// memakai fungsi aslinya (shouldSendNotification) + DB sungguhan.
// Jalankan: node test-notification-pipeline.js
require('ts-node').register();
require('dotenv').config();

const { sequelize } = require('./src/config/database');
const { User } = require('./src/models/user');
const { Product } = require('./src/models/product');
const { Alert } = require('./src/models/alert');
const { shouldSendNotification } = require('./src/jobs/priceCheck.job');

let pass = 0;
let fail = 0;

function check(name, actual, expected) {
  const ok = actual === expected;
  if (ok) { pass++; console.log(`  PASS  ${name} (expected=${expected})`); }
  else { fail++; console.log(`  FAIL  ${name} (expected=${expected}, got=${actual})`); }
}

async function reload(product) { return Product.findByPk(product.id); }

(async () => {
  console.log('\n=== Notification Pipeline Test ===\n');

  let user = await User.findOne({ where: { email: 'pipeline-test@example.com' } });
  if (!user) {
    user = await User.create({ email: 'pipeline-test@example.com', passwordHash: 'x', name: 'Pipeline Test' });
  }

  // reset products
  await Product.destroy({ where: { userId: user.id } });
  await Alert.destroy({ where: { userId: user.id } });

  const product = await Product.create({
    userId: user.id, name: 'Test Mouse Wireless', sourceUrl: 'https://shopee.co.id/x',
    normalizedUrl: 'https://shopee.co.id/product/1/1', status: 'active', currentPrice: 120000
  });

  // Alert: any_drop, cooldown 360 menit
  await Alert.create({ userId: user.id, productId: product.id, isActive: true, alertType: 'any_drop', cooldownMinutes: 360 });

  let p = await reload(product);

  console.log('[Scenario 1] Harga turun 120k -> 100k (belum pernah dinotifikasi)');
  check('should notify', await shouldSendNotification(p, 120000, 100000), true);

  // simulasikan notifikasi terkirim
  await Product.update({ lastNotifiedPrice: 100000, lastNotifiedAt: new Date() }, { where: { id: product.id } });
  p = await reload(product);

  console.log('[Scenario 2] DUPLIKAT: harga sama 100k -> 100k (lastNotifiedPrice=100k)');
  check('no notify (no drop)', await shouldSendNotification(p, 100000, 100000), false);

  console.log('[Scenario 3] COOLDOWN: harga turun lagi 100k -> 90k, tapi baru notif < 360m lalu');
  check('no notify (cooldown)', await shouldSendNotification(p, 100000, 90000), false);

  console.log('[Scenario 4] HARGA NAIK: 100k -> 150k');
  check('no notify (price up)', await shouldSendNotification(p, 100000, 150000), false);

  console.log('[Scenario 5] COOLDOWN LEWAT: set lastNotifiedAt 7 jam lalu, harga 100k -> 90k');
  await Product.update({ lastNotifiedAt: new Date(Date.now() - 7 * 3600 * 1000) }, { where: { id: product.id } });
  p = await reload(product);
  check('should notify after cooldown', await shouldSendNotification(p, 100000, 90000), true);

  console.log('[Scenario 6] ALERT NONAKTIF');
  await Alert.update({ isActive: false }, { where: { productId: product.id } });
  check('no notify (alert off)', await shouldSendNotification(p, 120000, 90000), false);

  // Test min_drop_percentage
  await Alert.destroy({ where: { productId: product.id } });
  await Product.update({ lastNotifiedPrice: null, lastNotifiedAt: null }, { where: { id: product.id } });
  await Alert.create({ userId: user.id, productId: product.id, isActive: true, alertType: 'min_drop_percentage', minDropPercentage: 5, cooldownMinutes: 360 });
  p = await reload(product);

  console.log('[Scenario 7] min_drop 5%: turun 120k -> 119k (0.83%)');
  check('no notify (drop too small)', await shouldSendNotification(p, 120000, 119000), false);

  console.log('[Scenario 8] min_drop 5%: turun 120k -> 100k (16.67%)');
  check('should notify (drop >= 5%)', await shouldSendNotification(p, 120000, 100000), true);

  // Cleanup
  await Product.destroy({ where: { userId: user.id } });
  await Alert.destroy({ where: { userId: user.id } });
  await sequelize.close();

  console.log(`\n=== Result: ${pass} passed, ${fail} failed ===\n`);
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => { console.error('Test error:', e); process.exit(1); });
