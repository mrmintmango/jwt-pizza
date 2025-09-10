# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      |   ⦁	Home.tsx       |        none       |     none     | 
| Register new user<br/>(t@jwt.com, pw: test)         |     register.tsx   |'/api/auth', 'POST'|INSERT INTO user (name, email, password) VALUES (?, ?, ?)<br> INSERT INTO userRole (userId, role, objectId) VALUES (?, ?, ?)|
| Login new user<br/>(t@jwt.com, pw: test)            |    login.tsx       |'/api/auth', 'PUT' |"SELECT * FROM user WHERE email=?" <br> "SELECT * FROM userRole WHERE userId=?" <br> "INSERT INTO auth (token, userId) VALUES (?, ?) ON DUPLICATE KEY UPDATE token=token" <br> |
| Order pizza                                         |  menu.tsx <br> card.tsx (pizza buttons) <br> payment.tsx   |  '/api/order/menu' <br> /api/franchise?page=${page}&limit=${limit}&name=${nameFilter} <br> /api/user/me <br> '/api/order', 'POST'  | "SELECT userId FROM auth WHERE token=?" <br> "SELECT * FROM menu" <br> "SELECT userId FROM auth WHERE token=?" <br> "SELECT id, name FROM franchise WHERE name LIKE ? LIMIT 201 OFFSET 0" <br> "SELECT id, name FROM store WHERE franchiseId=?" <br>  "SELECT userId FROM auth WHERE token=?" <br> "SELECT userId FROM auth WHERE token=?" <br> "INSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now())" <br> "INSERT INTO orderItem (orderId, menuId, description, price) VALUES (?, ?, ?, ?)"     |
| Verify pizza                                        |  delivery.tsx      | pizzaFactoryUrl + '/api/order/verify', 'POST' |   none??? It called the factory so I couldn't check on my backend for the SQL   |
| View profile page                                   |  dinerDashboard.tsx     | '/api/order'     |  "SELECT userId FROM auth WHERE token=?"  <br>  "SELECT id, franchiseId, storeId, date FROM dinerOrder WHERE dinerId=? LIMIT 0,10" <br> "SELECT id, menuId, description, price FROM orderItem WHERE orderId=?"      |
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
