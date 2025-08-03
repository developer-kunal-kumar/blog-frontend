import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, truncateText } from '../utils';
import './BlogCard.css';

const BlogCard = ({ blog }) => {
  return (
    <div className="blog-card">
      <div className="blog-card-content">
        <h2 className="blog-title">{blog.title}</h2>
        <p className="blog-excerpt">
          {truncateText(blog.content, 150)}
        </p>
        <div className="blog-meta">
          <span className="blog-author">
            By: {blog.author?.name || blog.author?.email || 'Unknown'}
          </span>
          <span className="blog-date">
            {formatDate(blog.createdAt)}
          </span>
        </div>
        <Link to={`/blog/${blog._id}`} className="btn btn-secondary read-more-btn">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard; 