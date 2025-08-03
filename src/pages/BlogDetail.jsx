import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BlogDetail.css';


const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchBlog();
    // Get current user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      setBlog(response.data);
      setLoading(false);
    } catch (err) {
      setError('Blog not found');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setError('Please login to delete this blog');
      setDeleteLoading(false);
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to delete blog');
      }
      setDeleteLoading(false);
    }
  };

  const isAuthor = () => {
    if (!blog || !currentUser) return false;
    return blog.author?._id === currentUser._id || blog.author === currentUser._id;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading blog...</div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container">
        <div className="error">
          <h2>Blog Not Found</h2>
          <p>The blog post you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="blog-detail">
        
        <div className="blog-header">
          <h1 className="blog-title">{blog.title}</h1>
          <div className="blog-meta">
            <span className="blog-author">
              By: {blog.author?.name || blog.author?.email || 'Unknown'}
            </span>
            <span className="blog-date">
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          </div>
         
        <div className="blog-content">
          <p>{blog.content}</p>
        </div>
        
        
        {/* Author Actions */}
        {isAuthor() && (
            <div className="author-actions">
              <Link to={`/edit/${blog._id}`} className="btn btn-primary">
                Edit Blog
              </Link>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-danger"
              >
                Delete Blog
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this blog post?</p>
              <p><strong>"{blog.title}"</strong></p>
              <p>This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail; 