// src/Pages/MyQuestions.jsx

import { useEffect, useState } from "react";
import { getMyQuestionsApi } from "../api/questionsApi";
import SimpleLayout from "../layouts/SimpleLayout";
import "./myQuestions.css";

function MyQuestions() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await getMyQuestionsApi(page, 10);
      
      // Handle wrapped API response
      const data = res.data || res;
      
      setQuestions(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page]);

  if (loading) {
    return (
      <SimpleLayout title="My Questions">
        <div className="questions-container">
          <div className="questions-card">
            <p className="questions-loading">Loading your questions...</p>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  if (error) {
    return (
      <SimpleLayout title="My Questions">
        <div className="questions-container">
          <div className="questions-card">
            <p className="questions-error">{error}</p>
            <button className="questions-retry-btn" onClick={fetchQuestions}>
              Try Again
            </button>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout title="My Questions">
      <div className="questions-container">
        <div className="questions-card">
          {/* Count Info */}
          <div className="questions-header">
            <p className="questions-count">
              {totalElements} question{totalElements !== 1 ? "s" : ""} asked
            </p>
          </div>

          {/* EMPTY STATE */}
          {questions.length === 0 ? (
            <div className="questions-empty">
              <p>No questions asked yet.</p>
              <button 
                className="questions-ask-btn"
                onClick={() => window.location.href = "/#services"}
              >
                Ask Your First Question
              </button>
            </div>
          ) : (
            <>
              {/* QUESTIONS LIST */}
              <div className="questions-list">
                {questions.map((q, index) => (
                  <div key={q.id} className="question-item">
                    <div className="question-number">#{index + 1 + page * 10}</div>
                    <p className="question-text">{q.question}</p>
                    <p className="question-date">
                      Asked on {new Date(q.askedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="questions-pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 0}
                  >
                    ← Previous
                  </button>
                  
                  <span className="pagination-info">
                    Page {page + 1} of {totalPages}
                  </span>
                  
                  <button
                    className="pagination-btn"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page + 1 >= totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </SimpleLayout>
  );
}

export default MyQuestions;