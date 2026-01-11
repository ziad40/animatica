import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { getStudentAnalysis, getStudentQuestionAnalysis } from "@/services/analysisService";
import QuestionDetails from "@/components/ui/QuestionDetails";
import AttemptDetails from "@/components/ui/AttemptDetails";
import ProgressChart from "@/components/ui/ProgressChart";

const StudentHistory = () => {
  const { user } = useContext(UserContext);
  const [analysis, setAnalysis] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionDetails, setQuestionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.role === "student") {
      fetchAnalysis();
    }
  }, [user]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const data = await getStudentAnalysis(user.username);
      setAnalysis(data);
    } catch (err) {
      setError("Failed to load analysis data.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionClick = async (questionId) => {
    try {
      const data = await getStudentQuestionAnalysis(user.username, questionId);
      setQuestionDetails(data.attemptsQuestionDetails[0]);
      setSelectedQuestion(questionId);
    } catch (err) {
      setError("Failed to load question details.");
    }
  };

  if (!user || user.role !== "student") {
    return <div className="text-center mt-10">Access denied. Only students can view this page.</div>;
  }

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Student Performance History</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Average Scores by Question Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.averageScores && analysis.averageScores.map((avg) => (
            <div key={avg.type} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium">{avg.type}</h3>
              <p className="text-2xl font-bold text-blue-600">{avg.averageScore.toFixed(2)}%</p>
            </div>
          ))}
        </div>
      </div>
      {analysis.progressRate && (
        <div className="mb-8">
          <ProgressChart progressRate={analysis.progressRate} />
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Solved Questions</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Question ID</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Attempts</th>
                <th className="px-4 py-2 text-left">Last Score</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {analysis.questionStats && analysis.questionStats.map((stat) => (
                <tr key={stat._id} className="border-t">
                  <td className="px-4 py-2">{stat._id}</td>
                  <td className="px-4 py-2">{stat.type}</td>
                  <td className="px-4 py-2">{stat.attempts}</td>
                  <td className="px-4 py-2">{(stat.lastScore * 100).toFixed(2)} %</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleQuestionClick(stat._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {questionDetails && (
        <div>
          <QuestionDetails questionDetails={questionDetails.questionDetails} />

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Your Attempts</h3>
            <div className="space-y-4">
              {questionDetails.attempts && questionDetails.attempts.map((attempt) => (
                <AttemptDetails
                  key={attempt._id}
                  attempt={attempt}
                  questionDetails={questionDetails.questionDetails}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHistory;