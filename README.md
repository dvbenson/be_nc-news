# **Northcoders News API**

<div id="user-content-toc">
  <ul>
    <summary><h2 style="display: inline-block;">Project Overview</h1></summary>
  </ul>
</div>

---

<br>

This JavaScript project uses **_Express.js_** with **_PostgreSQL_** as a database to demonstrate a **RESTful** API. It was created as part of a one-week solo sprint during my time as a student on Northcoders' full-stack Software Development bootcamp, to consolidate knowledge around C.R.U.D functionality.

Although its original design has been for use with a news website, it has the versatility to be adapted to other projects such as blogs, forums and social media platforms. Within this repository is a demonstration of my proficiency in developing and implementing a user-centred API for content management and creation.

The API will also form the backend of a frontend project built with **_React.js_**. Its functionality covers managing news articles, users and comments. The user is able to
post, update and delete articles and comments - as well as vote/downvote on articles and comments as seen on sites such as Reddit.

Once finishing with the sprint and deploying/hosting the API, I have since refactored and modularised my project for each endpoint as well as utilising react router. These changes reflect my ability to write clean, well-structured code in an MVC pattern.

<br>

<div id="user-content-toc">
  <ul>
    <summary><h2 style="display: inline-block;">API Endpoints</h1></summary>
  </ul>
</div>

---

_Users are able to access and interact with news data using the following **endpoints**:_
<br>
<br>

`GET all available endpoints`

```
https://badsauce-webservices.onrender.com/api
```

`GET a list of topics`

```
https://badsauce-webservices.onrender.com/topics
```

`POST a new topic`

```
Construct a post request body: { slug: "Topic name here, description: "Topic description here" }
```

```
https://badsauce-webservices.onrender.com/topics
```

`GET a list of users`

```
https://badsauce-webservices.onrender.com/users
```

`GET a single user by username`

```
https://badsauce-webservices.onrender.com/users/:username
```

`GET all articles, ordered, filtered by topic, sorted by a specified field and with pagination`

```
https://badsauce-webservices.onrender.com/articles
```

```
https://badsauce-webservices.onrender.com/articles?limit=10&p=3
```

```
https://badsauce-webservices.onrender.com/articles?sort_by=comment_count&order=desc
```

`POST a new article`

```
Construct a post request body: {
                              author: "author name here",
                              title: "title of article here",
                              body: "body of post here",
                              topic: "topic name here",
                              article_img_url: "<< img url here >>"
                              }
```

```
https://badsauce-webservices.onrender.com/articles
```

`GET & DELETE a specific article`

```
https://badsauce-webservices.onrender.com/articles/:article_id
```

`GET an article's comments, with pagination`

```
https://badsauce-webservices.onrender.com/articles/:article_id/comments
```

```
https://badsauce-webservices.onrender.com/articles/:article_id/comments?limit=10&p=3
```

`PATCH an article to vote on it`

```
Construct a request body: { inc_votes: 1 } or { inc_votes: -1 }
```

```
https://badsauce-webservices.onrender.com/articles/:article_id
```

`POST a new comment to a specific article`

```
Construct a request body: {
                         username: "username here",
                         body: "body of comment goes here"
                         }
```

```
https://badsauce-webservices.onrender.com/articles
```

`PATCH a comment to vote on it`

```
Construct a request body: { inc_votes: 1 } or { inc_votes: -1 }
```

```
https://badsauce-webservices.onrender.com/comments/:comment_id
```

`DELETE a comment`

```
https://badsauce-webservices.onrender.com/comments/:comment_id
```

## **Hosted Version**

---

<br>

Here is a live version of this app, hosted with [Render.](https://badsauce-webservices.onrender.com)

<br>

## **Setup**

---

<br>

_Follow the below instructions to get yourself started._

<br>

## **Installation and Minimum Requirements:**

<br>

- **Node.js:** 19.0.0 or later
- **PostgreSQL:** 12.12 or later

<br>

## **Cloning the repository:**

<br>

In your terminal, create a directory to clone the repository into:

```
$ mkdir <your new directory name>
```

Change directory:

```
$ cd <your new directory name>
```

Clone the repository:

```
$ git clone https://github.com/dvbenson/Project1_news_api.git
```

<br>

## **Dependencies:**

<br>

Run the below code in your terminal to install all required dependencies:

```
$ npm install
```

<br>

## **Dev & Test Environments:**

<br>

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

<br>

## **Database setup and seeding**

<br>

To setup both your development and test databases, run the following scripts:

Database Setup:

```
$ npm run setup-dbs
```

Seeding:

```
$ npm run seed
```

<br>

## **Testing**

<br>

The jest test suite is utilised for this app. Tests can be run with
the following script:

```
$ npm test
```

<br>

<div id="user-content-toc">
  <ul>
    <summary><h2 style="display: inline-block;">Full List of Dependencies</h1></summary>
  </ul>
</div>

---

<br>

_The following Node.js packages are required for this project:_

<br>

### **Production Dependencies**

<br>

| Package              | Version   | Usage                                         |
| :------------------- | :-------- | :-------------------------------------------- |
| <sub>dotenv</sub>    | `^16.0.0` | _Handles environment variable files_          |
| <sub>express</sub>   | `^4.18.2` | _Routes API requests_                         |
| <sub>pg</sub>        | `^8.7.3`  | _Queries PostgreSQL database_                 |
| <sub>pg-format</sub> | `^1.0.4`  | _Formats PostgreSQL to prevent SQL injection_ |

<br>

### **Developer Dependencies**

<br>

| Package                  | Version   | Usage                                                 |
| :----------------------- | :-------- | :---------------------------------------------------- |
| <sub>husky</sub>         | `^8.0.2`  | _Validates commit by running tests before committing_ |
| <sub>jest</sub>          | `^27.5.1` | _Provides framework for testing functionality_        |
| <sub>jest-extended</sub> | `^2.0.0`  | \__Adds additional jest testing identifiers_          |
| <sub>jest-sorted</sub>   | `^1.0.14` | _Adds sort testing for jest_                          |
| <sub>supertest</sub>     | `^6.3.3`  | _Adds simplified web request testing_                 |
