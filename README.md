# Synonym

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.3.

This app is used to search for synonyms of a word. The search functionality is provided on the landing page.  
If there are no synonyms for the desired word, users can add them through the 'Add synonyms' button.  
The app is sending requests to backend (http://stormy-tor-83845.herokuapp.com/) for retrieving synonyms, and adding new ones.  
It may take a while for the first request to pass since Heroku shuts down the backend app after being idle for some time.  
The app also uses an external API to get potential synonyms of a word for the user to add. This way, the user is restricted from using nonsense data and messing with the app. If there are multiple results on search, all of them are presented and grouped by word definition, which is retrieved from the external API.  
The app is fully responsive and can be used on any of the frequently used devices such as: mobile phones, tablets, laptops etc.  
This repository is linked with Heroku and whenever there is a new commit pushed, Heroku will build the app with the latest commits.  
Heroku app (make sure it's http, not https):  
http://reinvent-synonym.herokuapp.com/  
## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
