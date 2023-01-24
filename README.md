# **Northcoders News API**

## **Project Overview**

---

This JavaScript project uses **_Express.js_** with **_PostgreSQL_** as a database to demonstrate a **RESTful** API. It was created as part of a one-week solo sprint during my time as a student on Northcoders' full-stack Software Development bootcamp.

Although its original design has been for use with a news website, it has the versatility to be adapted to other projects such as blogs, forums and social media platforms. Within this repository is a demonstration of my proficiency in developing and implementing a user-centred API for content management and creation.

The API will also form the backend of a frontend project built with **_React.js_**. Its functionality covers managing news articles, users and comments. The user is able to
post, update and delete articles and comments - as well as vote/downvote on articles and comments as seen on sites such as Reddit.

---

## **API Endpoints**

Users are able to access and interact with news data using the following **endpoints**:

- **GET** all available endpoints

- **GET** a list of topics

- **GET** a list of users

- **GET** all articles, ordered, filtered by topic and sorted by a specified field

- **GET** a specific article

- **GET** an article's comments

- **PATCH** an article to vote on it

- **POST** a new comment to a specific article

- **DELETE** a comment

## **Hosted Version**

---

Here is a live version of this app, hosted with [Render.](https://badsauce-webservices.onrender.com)

## **Setup**

---

_Follow the below instructions to get yourself started._

### **Installation and Minimum Requirements:**

- **Node.js:** 19.0.0 or later
- **PostgreSQL:** 12.12 or later

### **Cloning the respository:**

In your terminal, create a directory to clone the repository into:

```
$ mkdir < your new directory name>
```

Change directory:

```
$ cd <your new directory name>
```

Clone the repository:

```
$ git clone https://github.com/dvbenson/Project1_news_api.git
```

### **Dependencies:**

---

Run the below code in your terminal to install all required dependencies:

```
$ npm install
```

### **Dev & Test Environments:**

Create two .env files:

```
$ touch .env.development
$ touch .env.test
```

Your `.env.development` file must contain the following line:

```
PGDATABASE=nc_news
```

Your `.env.test` file must contain the following line:

```
PGDATABASE=nc_news_test
```

### **Database setup and seeding**

To setup both your development and test databases, run the following scripts:

Database Setup:

```
$ npm run setup-dbs
```

Seeding:

```
$ npm run seed
```

### **Testing**

The jest test suite is utilised for this app. Tests can be run with
the following script:

```
$ npm test
```

---

## **Full list of Dependencies:**

The following Node.js packages are required for this project:

### **Production Dependencies**

| Package              | Version   | Usage                                         |
| :------------------- | :-------- | :-------------------------------------------- |
| <sub>dotenv</sub>    | `^16.0.0` | _Handles environment variable files_          |
| <sub>express</sub>   | `^4.18.2` | _Routes API requests_                         |
| <sub>pg</sub>        | `^8.7.3`  | _Queries PostgreSQL database_                 |
| <sub>pg-format</sub> | `^1.0.4`  | _Formats PostgreSQL to prevent SQL injection_ |

### **Developer Dependencies**

| Package                  | Version   | Usage                                                 |
| :----------------------- | :-------- | :---------------------------------------------------- |
| <sub>husky</sub>         | `^8.0.2`  | _Validates commit by running tests before committing_ |
| <sub>jest</sub>          | `^27.5.1` | _Provides framework for testing functionality_        |
| <sub>jest-extended</sub> | `^2.0.0`  | \__Adds additional jest testing identifiers_          |
| <sub>jest-sorted</sub>   | `^1.0.14` | _Adds sort testing for jest_                          |
| <sub>supertest</sub>     | `^6.3.3`  | _Adds simplified web request testing_                 |
