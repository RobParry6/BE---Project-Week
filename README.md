# Northcoders House of Games API

## Installing Necassary Files for Running

Before using this repository, a few files will need to be created in order for it to work. In order for the databases to be seeded properly, .env.test and env.development should be created and populated in the root directory of the project in order to set the ENV enviroment.

The contents of .env. files should be comparable to that found in the .enx-example.

Once these files have been created, make sure that they are not being commited to the overall project by checking the the .gitignore and ensuring that the .env.\* is present in that file.

## Running the Scripts

The next part of the installation is to run `npm init` to install all of the packages in the `package.json`. You'll all need to run `npm i express` and `npm i -D supertest` to ensure that all the files have the appropriate modules to run.

Next run `npm run setup-dbs` in order to setup the databases for files to work, and then `npm run seed` in order to seed them.

Lastly, `husky` will need to be setup, the installation of which can be found out the docs:

> https://typicode.github.io/husky/#/
