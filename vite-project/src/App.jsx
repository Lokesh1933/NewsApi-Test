import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [category, setCategory] = useState('business');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const apiKey = import.meta.env.VITE_NEWS_ID;  // Accessing the env variable
  const articlesPerPage = 5;  // Number of articles to show per page
  const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=${articlesPerPage}&page=${currentPage}&apiKey=${apiKey}`;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(apiUrl);
        setArticles(response.data.articles);
        setTotalResults(response.data.totalResults);  // Total number of articles available
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, currentPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="App">
      <div className="hero">
        <h1>Top Headlines</h1>
        <p>Select a category to get the latest news</p>
      </div>
      
      <div className="category-selector">
        <label htmlFor="category">Select Category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="business">Business</option>
          <option value="entertainment">Entertainment</option>
          <option value="health">Health</option>
          <option value="science">Science</option>
          <option value="sports">Sports</option>
          <option value="technology">Technology</option>
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="articles-list">
          {articles.length > 0 ? (
            <ul>
              {articles.map((article, index) => (
                <li key={index} className="article-card">
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    Read more
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No articles found.</p>
          )}

          {/* Pagination Controls */}
          {totalResults > articlesPerPage && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {Math.ceil(totalResults / articlesPerPage)}
              </span>
              <button
                disabled={currentPage * articlesPerPage >= totalResults}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
