# assignmet_backend


## API Endpoints

### User Authentication and Profile

- `POST /api/v1/user/login`: User login endpoint.

- `GET /api/v1/user/profile`: Retrieve user profile endpoint.
  - Requires authentication with JWT token.
  - User view profile information.

- `PUT /api/v1/user/profile`: Update user profile endpoint.
  - User update their profile details, including profile picture using JWT token.

### Category Operations

- `GET /api/v1/user/categories/all`: Retrieve all categories endpoint.

### Question Operations

- `GET /api/v1/user/question/:categoryId`: List questions by category endpoint.


- `POST /api/v1/questions/bulk`: Bulk import questions endpoint.
  - Bulk creation of questions by importing a CSV file.
  - Each question is associated with one or more categories specified in the CSV.
  - router -> v1 -> index.js