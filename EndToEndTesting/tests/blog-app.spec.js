
import { test, expect, beforeEach, describe } from '@playwright/test';
const { loginWith,createBlog,incrementLikes } = require('./helper');

describe('Blog app', () => {
        // empty the db here write the code to empty the db
        test.beforeEach(async ({ page, request }) => {  // It is used for setting up the testing environment before each test.
            console.log('Calling reset endpoint...')
            const resetResponse = await request.post('/api/testing/reset')
            console.log('Reset response status:', resetResponse.status())
            // Create a new user before each test
                const userResponse = await request.post('/api/users', {
                    data: {
                    name: 'Ahsan Nazmul',
                    username: 'ahsannet',
                    password: 'ahsan'
                    }
                })
                console.log('User creation response status:', userResponse.status())
            await page.goto('/')// Opens the front page of the application. 
          })

          //--------------------------------------------------------------------------------
          test('Login form is shown by default', async ({ page }) => {
            // Check if the login button is present and click it to show the login form
            const loginButton = await page.getByRole('button', { name: 'login' })
            await loginButton.click()
            // Check if the login form is visible
            const loginForm = await page.locator('form')
            expect(loginForm).toBeVisible()
          })
        //--------------------------------------------------------------------------------

        describe('Login', () => {
            test('succeeds with correct credentials', async ({ page }) => {
                // Assertions
                await loginWith(page, 'ahsannet', 'ahsan') // Logs in with the correct credentials 
                
                await expect(page.getByText('Ahsan Nazmul logged in')).toBeVisible()
                await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
                await expect(page.getByText('Login Successful')).toBeVisible()
            })
        
            test('fails with wrong credentials', async ({ page }) => {  // Logs in with the wrong credentials
                await loginWith(page, 'ahsannet', 'wrong')
                await expect(page.getByText('Wrong username or password')).toBeVisible()
            })
        })

        //--------------------------------------------------------------------------------
        describe('When logged in', () => {
            beforeEach(async ({ page }) => {
                await loginWith(page, 'ahsannet', 'ahsan')
            })
          
            test('a new blog can be created', async ({ page }) => {
                // Assertions
                await createBlog(page, 'Title: Ahsan Blog Test', 'Author:Author', 'Url:www.ex.com') // Creates a new blog
                await expect(page.getByText('Blog "Title: Ahsan Blog Test" by Author:Author added')).toBeVisible() //success message is visible 
                await expect(page.locator('div.blog')).toBeVisible() // Ensures that the blog is visible
            })
            //Do a test that makes sure the blog can be liked.

            test('a blog can be liked', async ({ page }) => {
                // Create a new blog
                await createBlog(page, 'Title: Ahsan Blog Test', 'Author:Author', 'Url:www.ex.com')
                // Like the blog
                //await page.getByRole('button', { name: 'view' }).click()
                //await page.getByRole('button', { name: 'like' }).click()
                await page.locator('button', { hasText: 'view' }).click()
                await page.locator('button', { hasText: 'like' }).click()
                await expect(page.getByText('likes 1')).toBeVisible()
            })

          //--------------------------------------------------------------------------------
          test('the user who added the blog can delete it', async ({ page }) => {
            // Create a new blog
            await createBlog(page, 'Title: Ahsan Blog Test', 'Author:Author', 'Url:www.ex.com');
            await expect(page.locator('div.blog')).toBeVisible() // Ensures that the blog is visible

            await page.locator('button', { hasText: 'view' }).click(); // View button is clicked
            // remove button is clicked
            await page.locator('button', { hasText: 'remove' }).click();
            // Confirm deletion in the prompt
            await page.on('dialog', async (dialog) => {
              expect(dialog.message()).toContain('Remove blog Title: Ahsan Blog Test by Author:Author?');
              await dialog.accept();
            });
        
          });
        }) 
        //--------------------------------------------------------------------------------
        test('only the user who added the blog sees the delete button', async ({ page }) => {
          // User A logs in and creates a blog
          await loginWith(page, 'ahsannet', 'ahsan');
          await createBlog(page, 'Title: User A Blog', 'Author: AuthorA', 'Url:www.example.com');
          
          // Verify User A can see the delete button
          await page.locator('button', { hasText: 'view' }).click();
          await expect(page.locator('button', { hasText: 'remove' })).toBeVisible();
        
          // Log out User A
          await page.locator('button', { hasText: 'logout' }).click();
        
          // Create a new user (User B)
          const newUserResponse = await page.request.post('/api/users', {
            data: {
              name: 'Another User',
              username: 'userb',
              password: 'password'
            }
          });
          console.log('User B creation response:', newUserResponse.status());
        
          // User B logs in
          await loginWith(page, 'userb', 'password');
          
          // Verify User B cannot see the delete button for User A's blog
          await page.locator('button', { hasText: 'view' }).click();
          await expect(page.locator('button', { hasText: 'remove' })).not.toBeVisible();
        });


        test.only('blogs are arranged in order of likes, with the most likes first', async ({ page }) => {
          // User logs in
          await loginWith(page, 'ahsannet', 'ahsan');
          
          // Create multiple blogs
          await createBlog(page, 'Blog 1', 'Author: Author1', 'Url:www.example1.com');
          await createBlog(page, 'Blog 2', 'Author: Author2', 'Url:www.example2.com');
          await createBlog(page, 'Blog 3', 'Author: Author3', 'Url:www.example3.com');
          
          // Increment likes using the helper function
          await incrementLikes(page, 'Blog 1', 2); // Increment 2 likes for Blog 1
          await incrementLikes(page, 'Blog 2', 1); // Increment 1 like for Blog 2
          await incrementLikes(page, 'Blog 3', 3); // Increment 3 likes for Blog 3
          
          // Reload page to verify order
          await page.reload();
          await page.waitForSelector('.blog', { state: 'attached' }); // Ensure blogs are loaded
        
          // Verify blogs are sorted in descending order of likes
          const blogs = await page.locator('.blog');
          const blogTitles = await blogs.locator('.blogTitle').allInnerTexts();
        
          // Strip 'Title: ' prefix
          const strippedTitles = blogTitles.map(title => title.replace('Title: ', ''));
          const expectedOrder = ['Blog 3', 'Blog 1', 'Blog 2'];
          expect(strippedTitles).toEqual(expectedOrder);
        });
}) 