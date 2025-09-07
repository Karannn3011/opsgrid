import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import api, { putWithTextBody, postWithoutBody } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import IssuesTable from "../../components/IssuesTable";
import Modal from "../../components/common/Modal";
import ReportIssueForm from "../../components/ReportIssueForm";
import PaginationControls from "../../components/common/PaginationControls";
import AIDiagnosticsModal from "../../components/AIDiagnosticsModal"; // Import
import {Loader} from "lucide-react"

function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAIDiagnosticsModalOpen, setIsAIDiagnosticsModalOpen] =
    useState(false);

  // AI State
  const [diagnosingIssue, setDiagnosingIssue] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  const { user } = useAuth();
  const isDriver = user?.roles?.includes("ROLE_DRIVER");

  const handleDiagnose = async (issue) => {
    setDiagnosingIssue(issue);
    setIsAIDiagnosticsModalOpen(true);
    setIsAiLoading(true);
    setAiResponse("");

    // 1. Define the AI service URL
    const aiServiceUrl = "https://text.pollinations.ai";

    // 2. Construct the prompt, just like we did on the backend
    const prompt = `As an expert truck mechanic, a driver reported an issue. Title: '${issue.title}'. Provide a numbered list of 3 probable causes and a separate numbered list of 3 recommended actions. Just give required answer only, no greetings.`;

    try {
      // 3. Make a direct GET request to the AI service using axios
      // We encode the prompt to make it URL-safe
      const fullUrl = `${aiServiceUrl}/${encodeURIComponent(prompt)}`;
      const response = await axios.get(fullUrl);

      // 4. The response data is the plain text from the AI
      setAiResponse(response.data);
    } catch (err) {
      console.error("Direct AI diagnosis failed:", err);
      setAiResponse(null); // Indicate an error
    } finally {
      setIsAiLoading(false);
    }
  };

  const fetchIssues = useCallback(
    async (page) => {
      let endpoint = isDriver ? "/issues/my-issues" : "/issues";
      try {
        setLoading(true);
        const response = await api.get(
          `${endpoint}?page=${page}&size=${PAGE_SIZE}&sort=createdAt,desc`,
        );
        const pageData = response.data;
        setIssues(pageData.content);
        setTotalPages(pageData.totalPages);
        setCurrentPage(pageData.number);
        setError(null);
      } catch (err) {
        setError("Failed to fetch issues.");
      } finally {
        setLoading(false);
      }
    },
    [isDriver],
  );

  useEffect(() => {
    fetchIssues(currentPage);
  }, [fetchIssues, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleIssueReported = () => {
    if (currentPage === 0) {
      fetchIssues(0);
    } else {
      setCurrentPage(0);
    }
    setIsModalOpen(false);
  };

  const handleUpdateStatus = async (issueId, newStatus) => {
    try {
      const response = await putWithTextBody(
        `/issues/${issueId}/status`,
        newStatus,
      );
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? response.data : i)),
      );
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Issue Tracking</h1>
          <p className="mt-1 text-gray-600">
            {isDriver
              ? "Report and view issues for your vehicle."
              : "Monitor and manage all reported issues."}
          </p>
        </div>
        {isDriver && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
          >
            Report New Issue
          </button>
        )}
      </div>

      {(loading || error) && (
    <div className="absolute flex top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 justify-center items-center p-8">
        {loading ? (
            <div className="flex flex-col items-center gap-2">
                <Loader className="h-8 w-8 mx-auto animate-spin text-blue-600 scale-130" />
            </div>
        ) : error ? (
            <p className="rounded-md bg-red-100 p-4 text-center text-red-700">
                {error}
            </p>
        ) : null}
    </div>
)}

      {!loading && !error && (
        <>
          <IssuesTable
            issues={issues}
            onUpdateStatus={handleUpdateStatus}
            onDiagnose={handleDiagnose}
          />
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Report New Issue"
      >
        <ReportIssueForm
          onIssueReported={handleIssueReported}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {diagnosingIssue && (
        <Modal
          isOpen={isAIDiagnosticsModalOpen}
          onClose={() => setIsAIDiagnosticsModalOpen(false)}
          title="AI Maintenance Diagnostics"
        >
          <AIDiagnosticsModal
            issue={diagnosingIssue}
            aiResponse={aiResponse}
            isLoading={isAiLoading}
            onCancel={() => setIsAIDiagnosticsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default IssuesPage;
