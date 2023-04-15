#!/usr/bin/env node

import fs from "fs";
import os from "os";
import path from "path";
import inquirer from "inquirer";
import { spawn } from "child_process";

const configFilePath = path.join(os.homedir(), "/pmanrc.json");
const configExists = fs.existsSync(configFilePath);

const openProject = (projectPath) => {
  spawn("open", ["-na", "iTerm", projectPath]);
  console.log("Project opened.");
};

const showProjects = () => {
  const configFile = JSON.parse(fs.readFileSync(configFilePath, "utf8"));

  inquirer
    .prompt([
      {
        type: "list",
        name: "directory",
        message: "Choose a directory:",
        choices: configFile.projectsDirs,
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
      },
    ])
    .then((answers) => {
      openProject(path.join(answers.directory, answers.project));
    });
};

const createConfig = () => {
  const configFile = JSON.parse(fs.readFileSync(configFilePath, "utf8"));

  inquirer
    .prompt([
      {
        type: "input",
        name: "newDir",
        message: "Enter your projects directory:",
        default: process.cwd(),
      },
    ])
    .then((answers) => {
      configFile.projectsDirs.push(path.normalize(answers.newDir));
      fs.writeFileSync(configFilePath, JSON.stringify(configFile, null, 2));
      showProjects();
    });
};

//Starts here
if (!configExists) {
  fs.writeFileSync(
    configFilePath,
    JSON.stringify({ projectsDirs: [] }, null, 2)
  );
  createConfig();
} else {
  showProjects();
  //MENU HERE
}
