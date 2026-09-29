import { readFile, writeFile, access } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
if (!(await exists('.env.local')))
  await writeFile('.env.local', await readFile('.env.example', 'utf8'));
if (!(await exists('cms/.env')))
  await writeFile('cms/.env', await readFile('cms/.env.example', 'utf8'));
let cms = await readFile('cms/.env', 'utf8');
const template = await readFile('cms/.env.example', 'utf8');
for (const line of template.split(/\r?\n/)) {
  const key = line.match(/^([A-Z_]+)=/)?.[1];
  if (key && !new RegExp(`^${key}=.+$`, 'm').test(cms)) {
    cms = cms.replace(new RegExp(`^${key}=.*(?:\\r?\\n|$)`, 'm'), '');
    cms = cms.trimEnd() + '\n' + line + '\n';
  }
}
cms = cms
  .replace(
    /replace-with-two-comma-separated-random-secrets/g,
    `${randomBytes(32).toString('hex')},${randomBytes(32).toString('hex')}`,
  )
  .replace(/replace-with-random-secret/g, () => randomBytes(32).toString('hex'));
await writeFile('cms/.env', cms);
console.log(
  'Environment files ready. Existing values preserved; placeholder CMS secrets generated. Configure database credentials in cms/.env and your API token in .env.local.',
);
