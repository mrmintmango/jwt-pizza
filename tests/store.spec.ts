import { test, expect } from 'playwright-test-coverage';
import { Page } from 'playwright';
import { Role, User } from '../src/service/pizzaService';

async function basicInit(page: Page) {
  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = {
    'd@jwt.com': { id: '3', name: 'Kai Chen', email: 'd@jwt.com', password: 'a', roles: [{ role: Role.Diner }] },
    'a@jwt.com': { id: '1', name: 'Admin User', email: 'a@jwt.com', password: 'admin', roles: [{ role: Role.Admin }] },
    'f@jwt.com': { id: '2', name: 'Franchisee', email: 'f@jwt.com', password: 'franchisee', roles: [{ role: Role.Franchisee }] }
  };



  // Authorize login for the given user
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = route.request().postDataJSON();
    const user = validUsers[loginReq.email];
    if (!user || user.password !== loginReq.password) {
      await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
      return;
    }
    loggedInUser = validUsers[loginReq.email];
    const loginRes = {
      user: loggedInUser,
      token: 'abcdef',
    };
    expect(route.request().method()).toBe('PUT');
    await route.fulfill({ json: loginRes });
  });

  // Return the currently logged in user
  await page.route('*/**/api/user/me', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: loggedInUser });
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

  // Standard franchises and stores
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
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  // Order a pizza.
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

  // Create franchise
  await page.route('*/**/api/franchise', async (route) => {
    if (route.request().method() === 'POST') {
      const franchiseReq = route.request().postDataJSON();
      const franchiseRes = {
        id: 5,
        name: franchiseReq.name,
        admins: franchiseReq.admins || [],
        stores: []
      };
      await route.fulfill({ json: franchiseRes });
      return;
    }
    // Handle GET requests for admin dashboard
    if (route.request().method() === 'GET') {
      const adminFranchises = {
        franchises: [
          {
            id: 2,
            name: 'Test Franchise',
            admins: [{ id: '2', name: 'Franchisee', email: 'f@jwt.com' }],
            stores: [
              { id: 8, name: 'Test Store', totalRevenue: 1000 }
            ]
          }
        ],
        more: false
      };
      await route.fulfill({ json: adminFranchises });
      return;
    }
  });

  // Delete franchise
  await page.route('*/**/api/franchise/*', async (route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({ json: { message: 'franchise deleted' } });
      return;
    }
    // Handle GET requests for specific franchise (user's franchises)
    if (route.request().method() === 'GET') {
      const userFranchises = [
        {
          id: 2,
          name: 'Test Franchise',
          admins: [{ id: '2', name: 'Franchisee', email: 'f@jwt.com' }],
          stores: [
            { id: 8, name: 'Test Store', totalRevenue: 1000 }
          ]
        }
      ];
      await route.fulfill({ json: userFranchises });
      return;
    }
  });

  // Create store
  await page.route('*/**/api/franchise/*/store', async (route) => {
    if (route.request().method() === 'POST') {
      const storeReq = route.request().postDataJSON();
      const storeRes = {
        id: 10,
        name: storeReq.name,
        totalRevenue: 0
      };
      await route.fulfill({ json: storeRes });
      return;
    }
  });

  // Delete store
  await page.route('*/**/api/franchise/*/store/*', async (route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({ json: { message: 'store deleted' } });
      return;
    }
  });

  await page.goto('/');
}

test('check franchise page', async ({ page }) => {
  await basicInit(page);

  //login first
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByText('Test Franchise')).toBeVisible();
});

test('create franchise', async ({ page }) => {
  await basicInit(page);

  //login first
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByText('Mama Ricci\'s kitchen')).toBeVisible();
  
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await expect(page.getByText('Want to create franchise?')).toBeVisible();
  
  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('test franchise');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('f@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();
  
  // Wait for navigation back to admin dashboard
  await expect(page.getByText('Mama Ricci\'s kitchen')).toBeVisible();
});

test('close franchise', async ({ page }) => {
  await basicInit(page);

  // Login as admin
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  // Go to admin dashboard
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByText('Mama Ricci\'s kitchen')).toBeVisible();
  
  // Click close button for a franchise (first close button in the table)
  await page.getByRole('button', { name: 'Close' }).first().click();
  await expect(page.getByText('Sorry to see you go')).toBeVisible();
  await expect(page.getByText('Are you sure you want to close the')).toBeVisible();
  
  // Confirm closing
  await page.getByRole('button', { name: 'Close' }).click();
  
  // Should navigate back to admin dashboard
  await expect(page.getByText('Mama Ricci\'s kitchen')).toBeVisible();
});

test('create store', async ({ page }) => {
  await basicInit(page);

  // Login as franchisee
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();

  // Go to franchise dashboard
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByText('Test Franchise')).toBeVisible();
  
  // Click create store button
  await page.getByRole('button', { name: 'Create store' }).click();
  await expect(page.getByText('Create store')).toBeVisible();
  
  // Fill in store details
  await page.getByRole('textbox', { name: 'store name' }).fill('New Test Store');
  await page.getByRole('button', { name: 'Create' }).click();
  
  // Should navigate back to franchise dashboard
  await expect(page.getByText('Test Franchise')).toBeVisible();
});

test('close store', async ({ page }) => {
  await basicInit(page);

  // Login as franchisee
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();

  // Go to franchise dashboard
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByText('Test Franchise')).toBeVisible();
  
  // Click close button for a store
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByText('Sorry to see you go')).toBeVisible();
  await expect(page.getByText('Are you sure you want to close the')).toBeVisible();
  
  // Confirm closing
  await page.getByRole('button', { name: 'Close' }).click();
  
  // Should navigate back to franchise dashboard
  await expect(page.getByText('Test Franchise')).toBeVisible();
});
        







