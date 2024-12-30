import { useState } from 'react'
const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)
  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    const blogWithUpdatedLikes = {
      ...blog,
      likes: blog.likes + 1,
    }
    await updateBlog(blog.id, blogWithUpdatedLikes) 
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await deleteBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle} className="blog">
      <div className="blogTitleAuthor">
        <span className="blogTitle">Title: {blog.title}</span> <span className="blogAuthor">Author: {blog.author}</span> <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className="showDetails">
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button onClick={handleLike}>like</button></p>
          <p>{blog.user.name}</p>
          {/* <p>{blog.user.username}</p> */}
          <button onClick={handleDelete}>remove</button>
        </div>
      )}
    </div>
  )
}

export default Blog