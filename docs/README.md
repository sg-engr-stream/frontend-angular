# SG Engineering Stream Hackathon - Frontend Angular

## N4NITIN
Site avaialble at : [N4NITIN](http://www.n4nit.in/) and [Heroku](https://short-url-front-prod.herokuapp.com/)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.0.

## Getting delvelopment server ready
Install `node`

Run below commands:
- `git clone https://github.com/sg-engr-stream/frontend-angular.git`
- `cd frontend-angular`
- `npm install`


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Add heroku origin and deploy
Create or own app using heroku cli (app name needs to be unique, below will not work)
- `heroku create app-stage --remote stage`
- `heroku create app-prod --remote prod`
- `git push stage master` 
<br>or
- `git push prod master`

Browse at provided address https://app-stage.herokuapp.com/  

## CI/CD and Reports
- [Travis-CI](https://travis-ci.com/github/sg-engr-stream/frontend-angular)
- [Codecov.io](https://codecov.io/gh/sg-engr-stream/frontend-angular)
- [Codacy.com](https://app.codacy.com/gh/sg-engr-stream/frontend-angular/dashboard)

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
