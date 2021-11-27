# ProbLoom

### Team 13, SWPP Fall 2021

[![Build Status](https://travis-ci.com/swsnu/swpp2021-team13.svg?branch=main)](https://travis-ci.com/swsnu/swpp2021-team13)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2021-team13&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2021-team13)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp2021-team13/badge.svg?branch=main)](https://coveralls.io/github/swsnu/swpp2021-team13?branch=main)

## Installation

### Back-End

First, you should install poetry. Follow the instructions [here](https://python-poetry.org/docs/).

```bash
cd swpp2021-team13/backend/probloom
poetry install -E ipython
poetry run python manage.py makemigrations
poetry run python manage.py migrate
```

### Front-End

First, you should install yarn 1.x. Follow the instructions [here](https://classic.yarnpkg.com/en/docs/install).

```bash
cd swpp2021-team13/frontend/probloom
yarn
```

## Testing (Optional)

### Back-End

```bash
cd swpp2021-team13/backend/probloom
poetry run coverage run
poetry run coverage report -m
```

### Front-End

```bash
cd swpp2021-team13/frontend/probloom
yarn test --coverage --watchAll=false
```

## Running Development Server

### Back-End

```bash
cd swpp2021-team13/backend/probloom
poetry run python manage.py runserver
```

### Front-End

```bash
cd swpp2021-team13/frontend/probloom
yarn start
```
