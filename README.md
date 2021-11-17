# ProbLoom

### Team 13, SWPP Fall 2021

[![Build Status](https://travis-ci.com/swsnu/swpp2021-team13.svg?branch=main)](https://travis-ci.com/swsnu/swpp2021-team13)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2021-team13&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2021-team13)
[![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp2021-team13/badge.svg?branch=main)](https://coveralls.io/github/swsnu/swpp2021-team13?branch=main)

## Installation

### Back-End

```bash
cd swpp2021-team13/backend/probloom
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
```

### Front-End

```bash
cd swpp2021-team13/frontend/probloom
yarn
```

## Testing (Optional)

### Back-End

```bash
cd swpp2021-team13/backend/probloom
coverage run --branch --source='.' manage.py test
coverage report -m
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
python manage.py runserver
```

### Front-End

```bash
cd swpp2021-team13/frontend/probloom
yarn start
```
