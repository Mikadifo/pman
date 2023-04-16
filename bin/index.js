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
  updateConfigConfirmation,
  updateConfigOptions,
} from "./questions.js";

const configFilePath = path.join(os.homedir(), "/pmanrc.json");
const configExists = fs.existsSync(configFilePath);

const readConfig = () => {
  return JSON.parse(fs.readFileSync(configFilePath, "utf8"));
};

const openProject = (projectPath) => {
  spawn("open", ["-a", "iTerm", projectPath]);
  console.log("Project opened in a new tab. You can close this tab now.");
};

const start = () => {
  const config = readConfig();

  inquirer
    .prompt([
      updateConfigConfirmation,
      {
        ...updateConfigOptions,
        when: (answers) => answers.updateConfig,
      },
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
      {
        ...projectsList,
        choices: (answers) =>
          fs
            .readdirSync(answers.directory)
            .filter((project) =>
              fs.statSync(path.join(answers.directory, project)).isDirectory()
            ),
        when: (answers) =>
          !answers.updateConfig && answers.directory.length > 0,
      },
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
        }
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
        start(config);
      } else {
        openProject(path.join(answers.directory, answers.project));
      }
    });
};

if (configExists) {
  start();
} else {
  inquirer.prompt([newDirQuestion]).then((answers) => {
    fs.writeFileSync(
      configFilePath,
      JSON.stringify({ projectsDirs: [answers.newDir] }, null, 2)
    );
    start();
  });
}
