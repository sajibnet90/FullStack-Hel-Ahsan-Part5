const loginWith = async (page, username, password)  => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'Submit' }).click()
  }

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByTestId('title').fill(title)// Fills the title field with the title parameter
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
  }

  // Helper function to increment likes for a blog
  const incrementLikes = async (page, blogTitle, numberOfLikes) => {
  const blog = page.locator('.blog').filter({ hasText: blogTitle });
  await blog.locator('button', { hasText: 'view' }).waitFor({ state: 'visible' });
  await blog.locator('button', { hasText: 'view' }).click();
  
  for (let i = 0; i < numberOfLikes; i++) {
    await blog.locator('button', { hasText: 'like' }).click();
    await page.waitForTimeout(500); // Small wait to ensure the like is processed
  }
}

  
  export { loginWith, createBlog, incrementLikes } // Exports the loginWith and createBlog functions.