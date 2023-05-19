#!/usr/bin/env node

import fs from "fs";
import os from "os";
import path from "path";
import inquirer from "inquirer";
import { spawn } from "child_process";
import {
  directoriesList,
  newDirQuestion,
  projectsList,
  terminalList,
  updateConfigConfirmation,
  updateConfigOptions,
} from "./questions.js";

const CONFIG_PATH = path.join(os.homedir(), "/pmanrc.json");
const configExists = fs.existsSync(CONFIG_PATH);

const readConfig = () => {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
};

const openProject = (projectPath, config) => {
  spawn("open", ["-a", config.terminal, projectPath]);
  console.log("Project opened in a new tab. You can close this tab now.");
};

const start = () => {
  const config = readConfig();

  inquirer
    .prompt([
      updateConfigConfirmation,
      updateConfigOptions,
      {
        ...directoriesList("editDir", config),
        when: (answers) =>
          answers.updateConfig && answers.updateOption.startsWith("Edit"),
      },
      {
        ...newDirQuestion,
        when: (answers) =>
          answers.updateConfig &&
          (answers.updateOption.startsWith("Add") ||
            answers.updateOption.startsWith("Edit")),
      },
      {
        ...directoriesList("removeDir", config),
        when: (answers) =>
          answers.updateConfig && answers.updateOption.startsWith("Remove"),
      },
      {
        ...directoriesList("directory", config),
        choices: config.projectsDirs,
        when: (answers) => !answers.updateConfig,
      },
      projectsList,
    ])
    .then((answers) => {
      if (answers.updateConfig) {
        switch (answers.updateOption.split(" ")[0]) {
          case "Add":
            config.projectsDirs.push(answers.newDir);
            console.log("Added " + answers.newDir);

            break;
          case "Edit":
            const oldDir = config.projectsDirs.indexOf(answers.editDir);
            config.projectsDirs[oldDir] = answers.newDir;
            console.log(`${answers.editDir} updated to ${answers.newDir}`);

            break;
          case "Remove":
            const selectedDir = config.projectsDirs.indexOf(answers.removeDir);
            config.projectsDirs.splice(selectedDir, 1);
            console.log("Removed " + answers.removeDir);

            break;
          case "Open":
            console.info(`Your config file is located at: ${CONFIG_PATH}`);
            break;
        }
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        start(config);
      } else {
        openProject(path.join(answers.directory, answers.project), config);
      }
    });
};

if (configExists) {
  start();
} else {
  inquirer.prompt([newDirQuestion, terminalList]).then((answers) => {
    fs.writeFileSync(
      CONFIG_PATH,
      JSON.stringify(
        { projectsDirs: [answers.newDir], terminal: answers.terminal },
        null,
        2
      )
    );
    start();
  });
}
