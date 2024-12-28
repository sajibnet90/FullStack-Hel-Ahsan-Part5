import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    if (user) {
      console.log('Fetching blogs for user:', user)
      blogService.getAll().then((blogs) => {
        console.log('Blogs fetched:', blogs)
        setBlogs(blogs)
      })
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('Logged user found in local storage:', user)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('Attempting login with username:', username)
    try {
      const user = await loginService.login({ username, password })
      console.log('Login successful, user:', user)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage('Login successful')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Login failed:', error)
      setErrorMessage('Wrong username or password')
      setTimeout(() => setErrorMessage(''), 3000)
    }
  }

  const handleLogout = () => {
    console.log('Logging out user:', user)
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    console.log('Adding new blog:', blogObject)
    try {
      const returnedBlog = await blogService.create(blogObject)
      console.log('Blog added successfully:', returnedBlog)
      setBlogs(blogs.concat(returnedBlog))
      setSuccessMessage(`Blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Failed to add blog:', error)
      setErrorMessage('Failed to add blog')
      setTimeout(() => setErrorMessage(''), 3000)
    }
  }

  const updateBlog = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map((blog) => (blog.id === id ? { ...returnedBlog, user: updatedBlog.user } : blog)))
    } catch (error) {
      setErrorMessage('Failed to update blog')
      setTimeout(() => setErrorMessage(''), 3000)
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
    } catch (error) {
      setErrorMessage('Failed to delete blog')
      setTimeout(() => setErrorMessage(''), 3000)
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  if (user === null) {
    console.log('No user logged in, showing login form.')

    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        {loginForm()}
      </div>
    )
  }
  console.log('User logged in, displaying blogs and blog form.')

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>Blogs</h2>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {sortedBlogs.map((blog) => (
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user} />
      ))}
    </div>
  )
}

export default App