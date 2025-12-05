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

