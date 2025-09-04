import React, { useState, useEffect, useCallback } from "react";
import api, { putWithTextBody } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import IssuesTable from "../../components/IssuesTable";
import Modal from "../../components/common/Modal";
import ReportIssueForm from "../../components/ReportIssueForm";
import PaginationControls from "../../components/common/PaginationControls";
import AIDiagnosticsModal from "../../components/AIDiagnosticsModal"; // Import

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
    try {
      const response = await api.post(`/ai/diagnose-issue/${issue.id}`);
      console.log(response);
      setAiResponse(response.data.responseText);
    } catch (err) {
      console.error("AI diagnosis failed:", err);
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

      {loading && <p>Loading issues...</p>}
      {error && <p className="text-center text-red-700">{error}</p>}

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
