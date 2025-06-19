# Job Tracker API 

Job Tracker is a backend API built with Node.js, Express.js, and MongoDB
designed to help users efficiently manage and monitor their job application
process. Whether you're actively job hunting or keeping track of future
opportunities, this tool provides a structured and streamlined way to stay
organized.

# 📌 Table of Contents
- [Features](#Features)
- [Getting Started](#Getting-Started)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Todos](#Todo)
- [Future Improvements](#Future--Improvements)
- [Acknowledgement](#Acknowledgement)
- [License](#license)

# 🔍 Features 
- Create and manage job applications: Store key details such as company name,
job title, status, dates, and notes.
- Track application status: Easily update and query applications by
customizable statuses like applied, interviewing, offer, and rejected.
- RESTful API endpoints: Clean, consistent, and scalable routes following
RESTful principles.
- Dockerized setup: Ensure smooth deployment and onboarding with a
pre-configured Docker and Docker Compose environment.
- Enum-based validation: Prevent inconsistent status values using defined enums
and schema validation.
- Testing suite with Jest: Unit and integration tests included for core logic
and endpoints, supporting long-term maintainability.
- Pluggable architecture: Modular folder structure for controllers, services,
routes, and models, allowing easy expansion as your needs evolve.

This project is designed with developer experience in mind and includes clearly
separated business logic, modern JavaScript best practices, and tooling to
support both development and production workflows.

# 🚀 Getting Started
These instructions will help you set up and run the Job Tracker API locally
using Docker, or directly via Node.js for development purposes.

## Prerequisites
Ensure you have the following installed on your system:

- Node.js (v18+ recommended)
- Docker
- Docker Compose
- MongoDB (if not using Docker)

# 🛠️ Installation & Setup
## Option 1: Using Docker (Recommended)
1. Clone the repository:

```bash
git clone https://github.com/your-username/job-tracker-api.git
cd job-tracker-api
npm install
```

2. Build and start the containers:

For production
```bash
docker-compose up --build
```
- Try running as `sudo` if fails

For Development
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

3. The server should now be running at `http://localhost:3000`

# 📡 API Endpoints

Base URL: `http://localhost:3000`

### 📁 Job Applications

#### Create a new job application
- **POST** `/applications`
- **Body** (JSON):
  ```json
  {
    "company": "Acme Inc",
    "title": "Software Engineer",
    "status": "applied", // must be one of the predefined enum values
    // appliedDate automatically inserted
    "notes": [ "Followed up with recruiter", "Given Cover letter" ] // must be an array
  }
#### Get all job applications
- **GET** `/applications`

#### Get a single job application by ID
- **GET** `/applications/:id`

#### Update a job application by ID
- **PUT** `/applications/:id`
- Body (JSON): any fields to update

#### Delete a job application by ID
- **DELETE** `/applications/:id`

#### Query the Database by any fields
By status
- **GET** `/applications?status=interviewing`
By Company 
- **GET** `/applications?company=Tesla`

...etcs

# Todo 
- [ ] test
- [ ] Test Performance
- [x] Use request body instead of route parameter
- [x] Query parameter for retrieval
- [x] PUT endpoint for updating an application
- [ ] Delete endpoint for deleting an application
- [x] create a notes field in the data schema
- [x] POST endpoint for notes 
- [x] ability to append notes
- [x] GET /applications/:id/suggestion returns a mock response
- [ ] Provide function to search the database for all notes, and return 
relevant jobapps

# Future Improvements 
- Use assert for more robust software
- Reduce duplication in some of the routes 
  - for example, new-notes and the general object update could be abstracted

# Problem with NIXOS
- upon testing with JEST, mongodb-memory-server does not support nixos out of the box
  - https://github.com/typegoose/mongodb-memory-server/issues/782

# Acknowledgement
- Development and documentation was assisted by openAI's O3 model

# 📄 License

MIT License

Copyright (c) 2025 [Ding-Han Yan](https://www.github.com/DHSYan)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

**THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.**
