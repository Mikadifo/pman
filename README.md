# pman

We often access our projects' folder using the terminal, but when you open a new terminal, you start in the root directory. Then, you'd have to move to the directory that contains your project. However, this is annoying when you have many projects in many directories.

**pman** is a npm package that will allow you to open your projects from the very first terminal you open.

# Installation

This package has to be installed globally, to do that just run the following command:

`npm install -g @mikadifo/pman`

If this doens't install the latest version or if you need to update the package, run this command:

`npm install -g @mikadifo/pman@latest`

# Use it

To start using this project manager just run the following command in your terminal:
`pman`

You'll be asked the following questions:

- Enter the path of the new directory: (This will be prompted only if it's your first time)
  **Default Value:** currentDirectory

- Do you want to update your directories? (This will be prompted every time you run the cli)
  **Default Value:** No

  If you enter 'Y', then you will be asked to choose an action:

  - Add, Edit or Remove a project directory

  When you choose Add, it will ask you to enter the new directory path. For Edit and Remove you will be asked to choose a directory from your current list to be edited or deleted respectively.

- Choose a directory: (This will be prompted when you select 'N' in the previous question. Here you choose a folder from the list of directories you have added.)
  **Default Value:** firstDirectoryPath

- Choose a project (Here you choose a subfolder from the directory you chose in the previous question.)
  **Default Value:** firstProjectPath

  After Selecting a project, a new terminal tab will be open in the root directory of the selected project. You can close the other tab if you want.

# Support

- It currently supports iTerm2 only.

# Contributing

Feel free to improve this package in any way, documentation, best practices, coding, new features, bugs reporting, etc.
