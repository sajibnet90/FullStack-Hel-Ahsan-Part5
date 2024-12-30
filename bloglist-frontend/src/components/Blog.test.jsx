import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


test('renders title and author, but not url or likes by default', async () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: {
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} />)

  const titleElement = screen.findByText('Test Blog Title'); // synchronus and  throw an error immidiately if the element is not found exactly, 'Title:' html  will through error if getByText is used  here  <span className="blogTitle">Title: {blog.title} </span> 
  expect(titleElement).toBeDefined();
  const authorElement = screen.findByText('Test Author');// findByText is asyncronous and will wait for the element to appear and find any text that matches the string 'Test Author' in the document and return it as a promise 
  expect(authorElement).toBeDefined();

  const urlElement = screen.queryByText('http://testurl.com')
  expect(urlElement).toBeNull()
  const likesElement = screen.queryByText('likes 5')
  expect(likesElement).toBeNull()
})

//--------------------------------------------------------------------

test('shows url and likes when the button controlling the shown details has been clicked', async () => {
    const blog = {
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 5,
      user: {
        name: 'Test User'
      }
    }
  
    render(<Blog blog={blog} />) // render the component with the blog object
    
    const button = screen.getByText('view')
    await userEvent.click(button) // click the button to show the details of the blog
    //screen.debug()
  
    const urlElement = screen.getByText('http://testurl.com')
    expect(urlElement).toBeDefined()
  
    const likesElement = screen.getByText('likes 5')
    expect(likesElement).toBeDefined()
  })
 
  //--------------------------------------------------------------------

  test('calls event handler twice when like button is clicked twice', async () => {
    const blog = {
      id: '123',
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 5,
      user: {
        name: 'Test User'
      }
    }
  
    const mockHandler = vi.fn((id, blogWithUpdatedLikes) => {
        console.log('blogWithUpdatedLikes:-',blogWithUpdatedLikes)
        blog.likes = blogWithUpdatedLikes.likes
      })

    render(<Blog blog={blog} updateBlog={mockHandler} />) //updateBlog is a function that is passed as a prop to the Blog component and is called when the like button is clicked 
    // The mock handler is used to simulate the updateBlog function that is passed as a prop to the Blog component

    const user = userEvent.setup()
    // First, click the 'view' button to reveal the 'like' button
    const viewButton = await screen.findByText('view')
    await user.click(viewButton)

    // Now, the 'like' button should be visible and clickable
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    // Debugging: Log the mock handler calls
    console.log(mockHandler.mock.calls)

    expect(mockHandler.mock.calls).toHaveLength(2)
    expect(mockHandler.mock.calls[0][1].likes).toBe(6)
  expect(mockHandler.mock.calls[1][1].likes).toBe(7)
  })


  /* 
  The mockHandler doesn’t directly access blog.id because it is a test double function. It is designed to simulate the behavior of the real updateBlog function without knowing the internal state of the Blog component.

Instead, the Blog component explicitly passes the id and the updated blog object (updatedBlog) to the mockHandler through the updateBlog(blog.id, updatedBlog) call. This mirrors how the component would interact with a real backend in a production environment.


  */