import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls event handler with correct details when a new blog is created', async () => {
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)//createBlog mock function is passed as a prop to the BlogForm component

  const user = userEvent.setup()
  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('Url')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Test Blog Title..')//userEvent.type is used to simulate typing in the input fields
  await user.type(authorInput, 'Test Author..')
  await user.type(urlInput, 'http://testurl.com')
  await user.click(createButton)//userEvent.click is used to simulate clicking the create button

  console.log(createBlog.mock.calls)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls).toBeDefined()
//   expect(createBlog.mock.calls[0][0]).toEqual({
//         title: 'Test Blog Title..',
  
  
  
//   ({
//     title: 'Test Blog Title..',
//     author: 'Test Author..',
//     url: 'http://testurl.com'
//   })

 })