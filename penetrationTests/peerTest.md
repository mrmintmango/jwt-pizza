## Attack Report

# Peers:
- Skyler Williams
- Ruben Matos

# Self Attack Records (Ruben Matos)

| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | December 3, 2025                                                               |
| Target         | pizza.theGameVault.click                                                       |
| Classification | Path Traversal                                                                 |
| Severity       | 2                                                                              |
| Description    | Docs were completely open for path traversal without authorization             |
| Images         | I forgot to take one.                                                          |
| Corrections    | added a sanitizePath function that prevents path traversal attempts            |



| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | December 4, 2025                                                               |
| Target         | pizza.theGameVault.click                                                       |
| Classification | Security Misconfiguration                                                      |
| Severity       | 2                                                                              |
| Description    | I didn't change the admin password from being 'admin'                          |
| Images         | This one doesn't need a pic                                                    |
| Corrections    | Updated the admin password to something more secure (no it's not 'cow')        |



| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | December 4, 2025                                                               |
| Target         | pizza.theGameVault.click                                                       |
| Classification | Authorization                                                                  |
| Severity       | 3                                                                              |
| Description    | I actually tried a bunch of different things here but couldn't get admin access through hacking, but I had AI double check and a bunch of vulnerabilities. Having the token in local storage is bad and having them never die means whoever gets a hold of a token will always have access to that account, especially since they can add the token to localstorage and get in.                         |
| Images         | This one doesn't need a pic                                                    |
| Corrections    | The backend needs to enforce all authorization and give the tokens an expiration date       |



| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | December 4, 2025                                                               |
| Target         | pizza.theGameVault.click                                                       |
| Classification | Broken access control                                                                  |
| Severity       | 3                                                                              |
| Description    | I'll be honest, I don't know how I would go about doing this one, but in the pizza service it's set up so any user can delete any other user, including admins. If someone uses a tool like Burp Suite, they can get a list of all users without being an admin and can even delete any user without authorization.                          |
| Images         | no pic                                                    |
| Corrections    | Add authorizition in backend to only allow admins to delete users, or for users to delete themselves (deleting an account)       |


| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | December 4, 2025                                                               |
| Target         | pizza.theGameVault.click                                                       |
| Classification | SQL Injection                                                                  |
| Severity       | 1                                                                              |
| Description    | SQL injection can delete the database or mess with all user info, I saw where it could happen and the code clearly showed vulnerabilities, but I didn't want to go through the hassle of wrecking my db and trying to recreate it again. It was found in the update user info fields and creating user info fields.                        |
| Images         | no pic                                                    |
| Corrections    | Sanatized user inputs in the backend to prevent this      |



# Self Attack Records (Skyler Williams)



# Peer Attack Records (Ruben Matos --> Skyler Williams)

| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | December 5, 2025                                                               |
| Target         | https://pizza.skycs329.click                                                   |
| Classification | Information Disclosure                                                         |
| Severity       | 3                                                                              |
| Description    | Homie never changed the admin password from being "admin" (*hacker voice*: I'm in)            |
| Images         | ![info disclosure screenshot](./Screenshot%202025-12-05%20091158.png "image")                                                          |
| Corrections    | change the password                                |



| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | December 5, 2025                                                               |
| Target         | https://pizza.skycs329.click                                                   |
| Classification | Path Traversal                                                                 |
| Severity       | 2                                                                              |
| Description    | Docs were completely open to anyone to access by simply typing /docs in the url path. I had a solid documentation for all api endpoints which could easily be exploited.              |
| Images         | ![path traversal screenshot](./Screenshot%202025-12-05%20184238.png "image")                                                       |
| Corrections    | ensure your docs are more secure and check for sneaky path vulnerabilities.          |



| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | December 5, 2025                                                               |
| Target         | https://pizza.skycs329.click                                                   |
| Classification | Broken Access Control                                                          |
| Severity       | 2                                                                              |
| Description    | By using Burp Suite I can change the price of the pizzas I order and still get a valid JWT Pizza token without paying anything.               |
| Images         | ![path traversal screenshot](./Screenshot%202025-12-05%20185340.png "image")                                                       |
| Corrections    | I don't know how you'd fix this one tbh                                        |



| Item           | Result                                                                         |
| -------------- | ------------------------------------------------------------------------------ |
| Date           | December 5, 2025                                                               |
| Target         | https://pizza.skycs329.click                                                   |
| Classification | SQL Injection                                                          |
| Severity       | -                                                                              |
| Description    | I attempted a simple SQL Injection attack but it failed, good job! I couldn't hit the submit button with SQL code in the user input field.                |
| Images         | ![path traversal screenshot](./Screenshot%202025-12-05%20194415.png "image")                                                       |
| Corrections    | Already corrected                                        |