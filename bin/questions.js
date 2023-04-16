export const newDirQuestion = {
  type: "input",
  name: "newDir",
  message: "Enter the path of the new directory:",
  default: process.cwd(),
};

export const updateConfigConfirmation = {
  type: "confirm",
  name: "updateConfig",
  message: "Do you want to update your directories?",
  default: false,
};

export const updateConfigOptions = {
  type: "list",
  name: "updateOption",
  message: "What do you want to do?",
  choices: ["Add new directory", "Edit a directory", "Remove a directory"],
};

export const directoriesList = (name, config) => {
  return {
    type: "list",
    name,
    message: "Choose a directory:",
    choices: config.projectsDirs,
  };
};

export const projectsList = {
  type: "list",
  name: "project",
  message: "Choose a project:",
};
