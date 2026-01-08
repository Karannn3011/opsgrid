import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import api, { putWithTextBody } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import IssuesTable from "../../components/IssuesTable";
import Modal from "../../components/common/Modal";
import ReportIssueForm from "../../components/ReportIssueForm";
import PaginationControls from "../../components/common/PaginationControls";
import AIDiagnosticsModal from "../../components/AIDiagnosticsModal";
import { Loader, AlertTriangle, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleGenAI } from "@google/genai";

// NOTE: In a real production app, you should proxy this through your backend to hide the key.
// For a personal project/demo, putting VITE_GEMINI_API_KEY in .env is acceptable.


function IssuesPage() {
  const { user } = useAuth();
  const isDriver = user?.roles?.includes("ROLE_DRIVER");

  useEffect(() => {
    document.title = isDriver
      ? "OpsGrid | My Reports"
      : "OpsGrid | Incident Command";
  }, [isDriver]);

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAIDiagnosticsModalOpen, setIsAIDiagnosticsModalOpen] =
    useState(false);

  // AI State
  const [diagnosingIssue, setDiagnosingIssue] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  const handleDiagnose = async (issue) => {
    setDiagnosingIssue(issue);
    setIsAIDiagnosticsModalOpen(true);
    setIsAiLoading(true);
    setAiResponse("");

    const prompt = `As an expert truck mechanic, a driver reported an issue. Title: '${issue.title}'. Provide a numbered list of 3 probable causes and a separate numbered list of 3 recommended actions. Just give required answer only, no greetings.`;

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });
      const text = response.text;
      setAiResponse(text);
    } catch (err) {
      console.error("Direct AI diagnosis failed:", err);
      setAiResponse(null);
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
          `${endpoint}?page=${page}&size=${PAGE_SIZE}&sort=createdAt,desc`
        );
        const pageData = response.data;
        setIssues(pageData.content);
        setTotalPages(pageData.totalPages);
        setCurrentPage(pageData.number);
        setError(null);
      } catch (err) {
        setError("Failed to fetch incident reports.");
      } finally {
        setLoading(false);
      }
    },
    [isDriver]
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
    setIsReportModalOpen(false);
  };

  const handleUpdateStatus = async (issueId, newStatus) => {
    try {
      // Backend expects text body for this PUT request
      const response = await api.put(
        `/issues/${issueId}/status`,
        newStatus,
        { headers: { "Content-Type": "text/plain" } } // Explicitly set text/plain if sending raw string
      );

      // Update local state to reflect change immediately
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? response.data : i))
      );
    } catch (err) {
      alert("Failed to update status: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
            {isDriver ? "Report Log" : "Incident Command"}
          </h1>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {isDriver
              ? "Vehicle Issues & Maintenance Requests"
              : "Fleet Alerts & Resolution Status"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="tactical"
            size="sm"
            onClick={() => fetchIssues(currentPage)}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            SYNC
          </Button>
          {isDriver && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsReportModalOpen(true)}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              REPORT INCIDENT
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading && issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-sm">
          <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
          <span className="text-xs font-mono uppercase text-muted-foreground">
            Accessing Incident Database...
          </span>
        </div>
      ) : error ? (
        <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive text-xs font-mono uppercase">
          Error: {error}
        </div>
      ) : (
        <>
          <IssuesTable
            issues={issues}
            onUpdateStatus={handleUpdateStatus}
            onDiagnose={handleDiagnose}
            isDriver={isDriver}
          />
          {totalPages > 1 && (
            <div className="mt-4">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="SUBMIT INCIDENT REPORT"
      >
        <ReportIssueForm
          onIssueReported={handleIssueReported}
          onCancel={() => setIsReportModalOpen(false)}
        />
      </Modal>

      {/* AI Modal */}
      {diagnosingIssue && (
        <Modal
          isOpen={isAIDiagnosticsModalOpen}
          onClose={() => setIsAIDiagnosticsModalOpen(false)}
          title={`AI DIAGNOSTICS: ${diagnosingIssue.title}`}
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
