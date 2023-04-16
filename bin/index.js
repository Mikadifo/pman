#!/usr/bin/env node

import fs from "fs";
import os from "os";
import path from "path";
import inquirer from "inquirer";
import { spawn } from "child_process";

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
      {
        type: "confirm",
        name: "updateConfig",
        message: "Do you want to update your directories?",
        default: false,
      },
      {
        type: "list",
        name: "updateOption",
        message: "What do you want to do?",
        choices: [
          "Add new directory",
          "Edit a directory",
          "Remove a directory",
        ],
        when: (answers) => answers.updateConfig,
      },
      {
        type: "list",
        name: "editDir",
        message: "Choose the directory you want to edit:",
        choices: config.projectsDirs,
        when: (answers) =>
          answers.updateConfig && answers.updateOption.startsWith("Edit"),
      },
      {
        type: "input",
        name: "newDir",
        message: "Enter the path of the new directory:",
        default: process.cwd(),
        when: (answers) =>
          answers.updateConfig &&
          (answers.updateOption.startsWith("Add") ||
            answers.updateOption.startsWith("Edit")),
      },
      {
        type: "list",
        name: "removeDir",
        message: "Choose the directory you want to remove:",
        choices: config.projectsDirs,
        when: (answers) =>
          answers.updateConfig && answers.updateOption.startsWith("Remove"),
      },
      {
        type: "list",
        name: "directory",
        message: "Choose a directory:",
        choices: config.projectsDirs,
        when: (answers) => !answers.updateConfig,
      },
      {
        type: "list",
        name: "project",
        message: "Choose a project:",
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
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDir",
        message: "Enter the path of the new directory:",
        default: process.cwd(),
      },
    ])
    .then((answers) => {
      fs.writeFileSync(
        configFilePath,
        JSON.stringify({ projectsDirs: [answers.newDir] }, null, 2)
      );
      start();
    });
}
