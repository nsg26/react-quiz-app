import { useContext, useRef, useEffect } from "react";
import Question from "./Question";
import { QuizContext } from "../contexts/quiz";

const Quiz = () => {
  const [quizState, dispatch] = useContext(QuizContext);
  // console.log("quizState", quizState);
  const apiUrl =
    "https://opentdb.com/api.php?amount=10&type=multiple&encode=url3986";
  const hasFetched = useRef(false); // Ref to track if fetch has occurred
  useEffect(() => {
    if (
      hasFetched.current ||
      quizState.questions.length > 0 ||
      quizState.error
    ) {
      return;
    }
    //console.log("on initialize");
    hasFetched.current = true; // Set to true to prevent further fetches
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        //console.log("data", data);
        dispatch({ type: "LOADED_QUESTIONS", payload: data.results });
      })
      .catch((err) => {
        //console.log("err", err.message);
        dispatch({ type: "SERVER_ERROR", payload: err.message });
      });
  });

  return (
    <div className="quiz">
      {quizState.error && (
        <div className="results">
          <div className="congratulations">SERVER ERROR</div>
          <div className="results-info">
            <div>{quizState.error}</div>
          </div>
        </div>
      )}
      {quizState.showResults && (
        <div className="results">
          <div className="congratulations">Congratulations</div>
          <div className="results-info">
            <div>Yov have completed the quiz.</div>
            <div>
              You've got {quizState.correctAnswersCount} of{" "}
              {quizState.questions.length}
            </div>
          </div>
          <div
            className="next-button"
            onClick={() => dispatch({ type: "RESTART" })}
          >
            Restart
          </div>
        </div>
      )}
      {!quizState.showResults && quizState.questions.length > 0 && (
        <div>
          <div className="score">
            Question {quizState.currentQuestionIndex + 1}/
            {quizState.questions.length}
          </div>
          <Question />
          <div
            className="next-button"
            onClick={() => dispatch({ type: "NEXT_QUESTION" })}
          >
            Next Question
          </div>
        </div>
      )}
    </div>
  );
};
export default Quiz;
