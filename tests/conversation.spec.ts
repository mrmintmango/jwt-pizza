import { test, expect } from 'playwright-test-coverage';
import { Page } from 'playwright';
import { Role, User } from '../src/service/pizzaService';

async function basicInit(page: Page) {
  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = {
    'a@jwt.com': { id: '1', name: 'Admin User', email: 'a@jwt.com', password: 'admin', roles: [{ role: Role.Admin }] }
  };
  const registeredUsers: Record<string, User> = {};

  // Handle all auth operations (login, logout, register)
  await page.route('*/**/api/auth', async (route) => {
    if (route.request().method() === 'DELETE') {
      // Logout
      loggedInUser = undefined;
      await route.fulfill({ json: { message: 'logout successful' } });
      return;
    }
    
    if (route.request().method() === 'POST') {
      // Register
      const registerReq = route.request().postDataJSON();
      const newUser = {
        id: `${Date.now()}`,
        name: registerReq.name,
        email: registerReq.email,
        password: registerReq.password,
        roles: [{ role: Role.Diner }]
      };
      registeredUsers[registerReq.email] = newUser;
      loggedInUser = newUser;
      const registerRes = {
        user: { id: newUser.id, name: newUser.name, email: newUser.email, roles: newUser.roles },
        token: 'newusertoken',
      };
      await route.fulfill({ json: registerRes });
      return;
    }
    
    if (route.request().method() === 'PUT') {
      // Login
      const loginReq = route.request().postDataJSON();
      const user = validUsers[loginReq.email] || registeredUsers[loginReq.email];
      if (!user || user.password !== loginReq.password) {
        await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
        return;
      }
      loggedInUser = user;
      const loginRes = {
        user: { id: user.id, name: user.name, email: user.email, roles: user.roles },
        token: 'abcdef',
      };
      await route.fulfill({ json: loginRes });
      return;
    }
  });

  // Return the currently logged in user
  await page.route('*/**/api/user/me', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: loggedInUser });
  });

  // Update user and Delete user
  await page.route('*/**/api/user/**', async (route) => {
    if (route.request().method() === 'PUT') {
      const updateReq = route.request().postDataJSON();
      if (loggedInUser) {
        // Update the user's information
        if (updateReq.name) loggedInUser.name = updateReq.name;
        if (updateReq.email) {
          // Update email in registeredUsers
          if (loggedInUser.email && registeredUsers[loggedInUser.email]) {
            delete registeredUsers[loggedInUser.email];
            registeredUsers[updateReq.email] = loggedInUser;
          }
          loggedInUser.email = updateReq.email;
        }
        if (updateReq.password) loggedInUser.password = updateReq.password;
        
        const updateRes = {
          user: { id: loggedInUser.id, name: loggedInUser.name, email: loggedInUser.email, roles: loggedInUser.roles },
          token: 'updatedtoken',
        };
        await route.fulfill({ json: updateRes });
      } else {
        await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
      }
      return;
    }
    
    // Delete user (admin action)
    if (route.request().method() === 'DELETE') {
      const userId = route.request().url().split('/').pop();
      console.log(`Deleting user with ID: ${userId}`);
      // Find and remove user from registeredUsers
      for (const email in registeredUsers) {
        if (registeredUsers[email].id === userId) {
          console.log(`Found and deleting user: ${email}`);
          delete registeredUsers[email];
          break;
        }
      }
      await route.fulfill({ json: { message: 'user deleted' } });
      return;
    }
  });

  // Get users list (admin)
  await page.route('*/**/api/user**', async (route) => {
    if (route.request().method() === 'GET') {
      const url = new URL(route.request().url());
      const page = parseInt(url.searchParams.get('page') || '0');
      const size = parseInt(url.searchParams.get('size') || '10');
      const nameFilter = url.searchParams.get('name') || '*';
      
      // Combine all users
      const allUsers = [...Object.values(validUsers), ...Object.values(registeredUsers)];
      
      // Filter users
      let filteredUsers = allUsers;
      if (nameFilter !== '*') {
        const filterPattern = nameFilter.replace(/\*/g, '');
        filteredUsers = allUsers.filter(u => 
          u.name?.toLowerCase().includes(filterPattern.toLowerCase()) ||
          u.email?.toLowerCase().includes(filterPattern.toLowerCase())
        );
      }
      
      // Paginate
      const start = page * size;
      const end = start + size;
      const paginatedUsers = filteredUsers.slice(start, end);
      
      const userList = {
        users: paginatedUsers.map(u => ({ id: u.id, name: u.name, email: u.email, roles: u.roles })),
        more: end < filteredUsers.length
      };
      
      await route.fulfill({ json: userList });
      return;
    }
  });

  // A standard menu
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      {
        id: 1,
        title: 'Veggie',
        image: 'pizza1.png',
        price: 0.0038,
        description: 'A garden of delight',
      },
      {
        id: 2,
        title: 'Pepperoni',
        image: 'pizza2.png',
        price: 0.0042,
        description: 'Spicy treat',
      },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  // Standard franchises
  await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
    const franchiseRes = {
      franchises: [
        {
          id: 2,
          name: 'LotaPizza',
          stores: [
            { id: 4, name: 'Lehi' },
            { id: 5, name: 'Springville' },
            { id: 6, name: 'American Fork' },
          ],
        },
        { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
        { id: 4, name: 'topSpot', stores: [] },
      ],
      more: false
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  // Order endpoints
  await page.route('*/**/api/order', async (route) => {
    if (route.request().method() !== 'POST') {
      expect(route.request().method()).toBe('GET');
      await route.fulfill({ json: { orders: [] } });
      return;
    }
    const orderReq = route.request().postDataJSON();
    const orderRes = {
      order: { ...orderReq, id: 23 },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: orderRes });
  });

  await page.goto('/');
}

test('updateUser', async ({ page }) => {
  await basicInit(page);
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('pizza diner');
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Register' }).click();

  await page.getByRole('link', { name: 'pd' }).click();

  await expect(page.getByRole('main')).toContainText('pizza diner');

  await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page.locator('h3')).toContainText('Edit user');
  await page.getByRole('textbox').first().fill('pizza dinerx');
  await page.getByRole('button', { name: 'Update' }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

  await expect(page.getByRole('main')).toContainText('pizza dinerx');

  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'pd' }).click();

  await expect(page.getByRole('main')).toContainText('pizza dinerx');

});

test('update user email', async ({ page }) => {
  await basicInit(page);
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('pizza diner');
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByRole('link', { name: 'pd' }).click();
  await expect(page.getByRole('main')).toContainText('pizza diner');

  const newEmail = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page.locator('h3')).toContainText('Edit user');
  await page.getByRole('textbox').nth(1).fill(newEmail);
  await page.getByRole('button', { name: 'Update' }).click();
  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });
  await expect(page.getByRole('main')).toContainText('pizza diner');
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill(newEmail);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'pd' }).click();
  await expect(page.getByRole('main')).toContainText('pizza diner');
});

test('update user password', async ({ page }) => {
  await basicInit(page);
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('pizza diner');
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByRole('link', { name: 'pd' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.locator('#password').click();
  await page.locator('#password').fill('test');
  await page.getByRole('button', { name: 'Update' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).click(); 
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('test');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'pd' }).click();
  await expect(page.getByRole('main')).toContainText('pizza diner');
});

test('admin portal list users', async ({ page }) => {
  await basicInit(page);
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('main')).toContainText('Users');
});

test('admin delete user', async ({ page }) => {
  await basicInit(page);
  await page.getByRole('link', { name: 'Register' }).click();
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.getByRole('textbox', { name: 'Full name' }).fill('delete me');
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  
  // Verify the user is in the list
  await expect(page.getByRole('main')).toContainText('Users');
  
  // Filter for the user to find them easily
  await page.getByRole('textbox', { name: 'Filter users' }).fill('delete me');
  await page.getByRole('cell', { name: 'delete me Submit' }).getByRole('button').click();
 
  // Wait for the filtered user to appear
  await expect(page.getByRole('cell', { name: email })).toBeVisible();
  
  // Count how many rows we have before deletion
  const rowsBefore = await page.getByRole('row').filter({ hasText: 'delete me' }).count();
  expect(rowsBefore).toBeGreaterThan(0);
  
  // Set up ALL handlers BEFORE clicking - they need to be ready when click happens
  const deletePromise = page.waitForResponse(response => 
    response.url().includes('/api/user/') && response.request().method() === 'DELETE'
  );
  
  const refreshPromise = page.waitForResponse(response => 
    response.url().includes('/api/user?') && response.request().method() === 'GET'
  );
  
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.accept().catch(() => {});
  });
  
  // Find the row with the user's email and click the delete button in that row
  await page.getByRole('row').filter({ hasText: email }).getByRole('button', { name: 'Delete' }).click();
  
  // Wait for both requests to complete
  await deletePromise;
  await refreshPromise;
  
  // Wait for the UI to update
  await page.waitForTimeout(1000);
  
  // The user should disappear from the current view
  const rowsAfter = await page.getByRole('row').filter({ hasText: 'delete me' }).count();
  expect(rowsAfter).toBe(0);
});

test('pagination check', async ({ page }) => {
  await basicInit(page);
  
  // Register 12 users to enable pagination (10 per page)
  for (let i = 1; i <= 12; i++) {
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('textbox', { name: 'Full name' }).fill(`User ${i}`);
    await page.getByRole('textbox', { name: 'Email address' }).fill(`user${i}@test.com`);
    await page.getByRole('textbox', { name: 'Password' }).fill('password');
    await page.getByRole('button', { name: 'Register' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();
  }
  
  // Login as admin
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('main')).toContainText('Users');
  
  // Verify we're on page 1 with the admin user and some registered users
  await expect(page.getByRole('cell', { name: 'a@jwt.com' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'user1@test.com' })).toBeVisible();
  
  // Click next page button (should be enabled now)
  await page.getByRole('button', { name: '»' }).nth(1).click();
  
  // Wait for navigation
  await page.waitForTimeout(300);
  
  // Verify we're on page 2 - admin should not be visible, but later users should be
  await expect(page.getByRole('cell', { name: 'a@jwt.com' })).not.toBeVisible();
  await expect(page.getByRole('cell', { name: 'user11@test.com' })).toBeVisible();
});
