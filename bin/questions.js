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

export const projectsList = (limit) => ({
  type: "search-list",
  name: "project",
  message: "Choose a project:",
  choices: (answers) =>
    fs
      .readdirSync(answers.directory)
      .filter((project) =>
        fs.statSync(path.join(answers.directory, project)).isDirectory()
      )
      .slice(0, limit > 0 ? limit : undefined),
  when: (answers) => !answers.updateConfig && answers.directory.length > 0,
});

export const WSL = {
  type: "confirm",
  name: "wsl",
  message: "Are you using WSL?",
  default: false,
};
