#!/usr/bin/env node

import fs from "fs";
import os from "os";
import path from "path";
import inquirer from "inquirer";
import { spawn } from "child_process";

const configFilePath = path.join(os.homedir(), "/pmanrc.json");
const configExists = fs.existsSync(configFilePath);

const openProject = (projectPath) => {
  spawn("open", ["-a", "iTerm", projectPath]);
  console.log("Project opened");
};

const showProjects = () => {
  const projectsFolder = JSON.parse(
    fs.readFileSync(configFilePath, "utf8")
  ).projectDir;
  const files = fs.readdirSync(projectsFolder);
  const projects = files.filter((file) =>
    fs.statSync(path.join(projectsFolder, file)).isDirectory()
  );

  inquirer
    .prompt([
      {
        type: "list",
        name: "project",
        message: "Choose a project",
        choices: projects,
      },
    ])
    .then((answers) => {
      openProject(path.join(projectsFolder, answers.project));
    });
};

const createConfig = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "projectDir",
        message: "Enter your projects directory",
        default: process.cwd(),
      },
    ])
    .then((answers) => {
      fs.writeFileSync(
        configFilePath,
        JSON.stringify({ projectDir: answers.projectDir }, null, 2)
      );
      showProjects();
    });
};

if (!configExists) {
  createConfig();
} else {
  showProjects();
}
