import * as core from '@actions/core';
import { runCommand } from '../utils';

export const releaseDockerContainer = async ({
  herokuApiKey,
  herokuAppName,
  cwd,
  processType,
}: {
  herokuAppName: string;
  herokuApiKey: string;
  cwd: string;
  processType: string;
}): Promise<boolean> => {
  try {
    core.startGroup('Releasing container...');
    await runCommand(`heroku container:release ${processType} --app ${herokuAppName}`, {
      env: { HEROKU_API_KEY: herokuApiKey },
      options: { cwd },
    });
    console.log('Container released.');
    core.endGroup();
    return true;
  } catch (err: unknown) {
    core.endGroup();
    if (err instanceof Error) {
      core.setFailed(`Releasing docker container failed.\nError: ${err.message}`);
    } else {
      core.setFailed(`Releasing docker container failed.\nError: ${String(err)}`);
    }
    return false;
  }
};
