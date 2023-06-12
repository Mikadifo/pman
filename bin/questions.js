import fs from "fs";
import path from "path";

export const newDirQuestion = {
  type: "input",
  name: "newDir",
  message: "Enter the path of the new directory:",
  default: process.cwd(),
};

export const updateConfigConfirmation = {
  type: "confirm",
  name: "updateConfig",
  message: "Do you want to update your configuration?",
  default: false,
};

export const updateConfigOptions = {
  type: "search-list",
  name: "updateOption",
  message: "What do you want to do?",
  choices: [
    "Add new directory",
    "Edit a directory",
    "Remove a directory",
    "Open config file",
  ],
  when: (answers) => answers.updateConfig,
};

export const directoriesList = (name, config) => {
  return {
    type: "search-list",
    name,
    message: "Choose a directory:",
    choices: config.projectsDirs,
  };
};

export const projectsList = {
  type: "search-list",
  name: "project",
  message: "Choose a project:",
  choices: (answers) =>
    fs
      .readdirSync(answers.directory)
      .filter((project) =>
        fs.statSync(path.join(answers.directory, project)).isDirectory()
      ),
  when: (answers) => !answers.updateConfig && answers.directory.length > 0,
};

export const terminalList = {
  type: "search-list",
  name: "terminal",
  message: "Choose a terminal to open your projects:",
  choices: ["iTerm", "Terminal"],
};
