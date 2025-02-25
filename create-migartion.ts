import { execSync } from 'child_process';

const name = process.argv[2];
execSync(
    `npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create src/migration/${name}`,
    { stdio: 'inherit' },
);