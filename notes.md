# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      |   ⦁	Home.tsx       |        none       |     none     | 
| Register new user<br/>(t@jwt.com, pw: test)         |     register.tsx   |'/api/auth', 'POST'|INSERT INTO user (name, email, password) VALUES (?, ?, ?)<br> INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)|
| Login new user<br/>(t@jwt.com, pw: test)            |    login.tsx       |'/api/auth', 'PUT' |"SELECT * FROM user WHERE email=?" <br> "SELECT * FROM userRole WHERE userId=?" <br> "INSERT INTO auth (token, userId) VALUES (?, ?) ON DUPLICATE KEY UPDATE token=token" <br>               |
| Order pizza                                         |                    |                   |              |
| Verify pizza                                        |                    |                   |              |
| View profile page                                   |                    |                   |              |
| View franchise<br/>(as diner)                       |                    |                   |              |
| Logout                                              |    logout.tsx      | '/api/auth', 'DELETE' | "SELECT userId FROM auth WHERE token=?" <br> "DELETE FROM auth WHERE token=?"   |
| View About page                                     |                    |                   |              |
| View History page                                   |                    |                   |              |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) |                    |                   |              |
| View franchise<br/>(as franchisee)                  |                    |                   |              |
| Create a store                                      |                    |                   |              |
| Close a store                                       |                    |                   |              |
| Login as admin<br/>(a@jwt.com, pw: admin)           |                    |                   |              |
| View Admin page                                     |                    |                   |              |
| Create a franchise for t@jwt.com                    |                    |                   |              |
| Close the franchise for t@jwt.com                   |                    |                   |              |
