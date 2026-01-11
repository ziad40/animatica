import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { getAllStudents, getAllStudentsStatistics, getStudentAnalysis, getStudentQuestionAnalysis } from "@/services/analysisService";
import QuestionDetails from "@/components/ui/QuestionDetails";
import AttemptDetails from "@/components/ui/AttemptDetails";
import ProgressChart from "@/components/ui/ProgressChart";



const TeacherDashboard = () => {
  const { user } = useContext(UserContext);
  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentAnalysis, setStudentAnalysis] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionDetails, setQuestionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.role === "teacher") {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsData, statsData] = await Promise.all([
        getAllStudents(),
        getAllStudentsStatistics()
      ]);
      setStudents(studentsData);
      setStatistics(statsData);
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSelect = async (student) => {
    try {
      const data = await getStudentAnalysis(student.name);
      setStudentAnalysis(data);
      setSelectedStudent(student);
      setSelectedQuestion(null);
      setQuestionDetails(null);
    } catch (err) {
      setError("Failed to load student analysis.");
    }
  };

  const handleQuestionClick = async (questionId) => {
    try {
      const data = await getStudentQuestionAnalysis(selectedStudent.name, questionId);
      setQuestionDetails(data.attemptsQuestionDetails[0]);
      setSelectedQuestion(questionId);
    } catch (err) {
      setError("Failed to load question details.");
    }
  };

  if (!user || user.role !== "teacher") {
    return <div className="text-center mt-10">Access denied. Only teachers can view this page.</div>;
  }

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Overall Student Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(statistics).map(([type, avg]) => (
            <div key={type} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium">{type}</h3>
              <p className="text-2xl font-bold text-green-600">{avg.toFixed(2)}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Students</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">email</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-t">
                  <td className="px-4 py-2">{student.name}</td>
                  <td className="px-4 py-2">{student.email}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleStudentSelect(student)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Performance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {studentAnalysis && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Performance for {selectedStudent.name}</h2>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Average Scores by Question Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentAnalysis.averageScores && studentAnalysis.averageScores.map((avg) => (
                <div key={avg.type} className="bg-gray-100 p-3 rounded">
                  <h4 className="font-medium">{avg.type}</h4>
                  <p className="text-xl font-bold">{avg.averageScore.toFixed(2)}%</p>
                </div>
              ))}
            </div>
          </div>
          {studentAnalysis.progressRate && (
            <div className="mb-8">
              <ProgressChart progressRate={studentAnalysis.progressRate} />
            </div>
          )}
          <div>
            <h3 className="text-lg font-medium mb-2">Solved Questions</h3>
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
                  {studentAnalysis.questionStats && studentAnalysis.questionStats.map((stat) => (
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
        </div>
      )}

      {questionDetails && (
        <div>
          <QuestionDetails questionDetails={questionDetails.questionDetails} />

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Student Attempts</h3>
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

export default TeacherDashboard;