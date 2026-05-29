import 'dotenv/config';
import { getSequelize } from '@kissan/shared';

async function run() {
  const sequelize = await getSequelize();
  const [results] = await sequelize.query(`
    SELECT pg_get_constraintdef(oid) AS def
    FROM pg_constraint
    WHERE conname = 'admin_users_role_check';
  `);
  console.log('CONSTRAINT DEFINITION:', results[0].def);
  process.exit(0);
}
run();
