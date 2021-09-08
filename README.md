# Open Resource API

The goal of this project is to provide all 211s with an equal opportunity at a rich user experience, modern speed and efficiency for data searchability, and a low barrier to entry.

## Dependencies

- Amazon Web Services
  - Cognito
  - Simple Email Service
- A hosting platform
  - We recommend Digital Ocean App Platform
  - Other options include Render, Heroku, etc.
- Google Places
- ElasticSearch
- MySQL

## Run Locally

Clone the project

```bash
  git clone https://github.com/211-Connect/open-resource-api
```

Go to the project directory

```bash
  cd open-resource-api
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Deployment

For automated CI/CD we recommend (and support in this project) Digital Ocean App Platform. Getting set up is as simple as clicking the deploy button below.

[![Deploy to DO](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/211-Connect/open-resource-api/tree/main)

If you'd like to host this on your own, or on an alternative platform, you'll need to do the following:

install dependencies

```bash
npm install
```

build the project

```bash
npm run build
```

and then start the server

```bash
npm start
```

## License

Copyright (C) 2021 Connect 211

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>
