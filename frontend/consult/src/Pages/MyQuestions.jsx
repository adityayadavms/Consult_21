import { useEffect, useState } from "react";
import { getMyQuestionsApi } from "../api/questionsApi";

function MyQuestions() {

  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  ===============================
  FETCH QUESTIONS
  ===============================
  */

  const fetchQuestions = async () => {
    try {

      setLoading(true);

      const res = await getMyQuestionsApi(page, 10);

      const data = res.data;

      setQuestions(data.content);
      setTotalPages(data.totalPages);

    } catch (err) {

      setError("Failed to load questions");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page]);

  /*
  ===============================
  UI STATES
  ===============================
  */

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  return (
    <div className="container">

      <h2>My Questions</h2>

      {/* EMPTY STATE */}
      {questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <>
          <div style={{ marginTop: "20px" }}>

            {questions.map((q) => (
              <div
                key={q.id}
                style={{
                  border: "1px solid #333",
                  padding: "15px",
                  borderRadius: "10px",
                  marginBottom: "15px"
                }}
              >
                <p><strong>Question:</strong> {q.question}</p>
                <p style={{ fontSize: "12px", color: "#aaa" }}>
                  Asked at: {new Date(q.askedAt).toLocaleString()}
                </p>
              </div>
            ))}

          </div>

          {/* PAGINATION */}
          <div style={{ marginTop: "20px" }}>

            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
            >
              Prev
            </button>

            <span style={{ margin: "0 10px" }}>
              Page {page + 1} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page + 1 >= totalPages}
            >
              Next
            </button>

          </div>
        </>
      )}
    </div>
  );
}

export default MyQuestions;