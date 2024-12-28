// services/blogs.js
import axios from 'axios'
const baseUrl = '/api/blogs';
//const baseUrl ='http://localhost:3001/api/blogs'

let token = null

const setToken = newToken => {
  console.log('Setting token:', newToken)
  token = `Bearer ${newToken}`
}
console.log('Token with bearer word:',token)

// const getAll = async () => {
//   console.log('Fetching all blogs.');
//   const response = await axios.get(baseUrl);
//   //console.log('Blogs fetched:', response.data);
//   return response.data;
// };
const getAll = async () => {
  console.log('Fetching all blogs.')
  const response = await axios.get(baseUrl)
  const blogs = response.data.map(blog => ({
    ...blog,
    user: blog.user || { id: 'unknown', name: 'Unknown' } // Ensure user field is populated
  }));
  return blogs
};

const create = async (newObject) => {
  console.log('Creating new blog:', newObject);
  console.log('Token being sent:', token)  // Check the token value
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  console.log('Blog created:', response.data)
  return response.data
};

const update = async (id, updatedObject) => {
  console.log('Updating blog:', id, updatedObject)
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.put(`${baseUrl}/${id}`, updatedObject, config);
  console.log('Blog updated:', response.data)
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  await axios.delete(`${baseUrl}/${id}`, config);
};



export default { getAll, create, setToken, update, remove };
