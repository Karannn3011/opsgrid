import React, { useState } from "react";
import api from "../services/api";
import { Bot } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

// NOTE: In a real production app, you should proxy this through your backend to hide the key.
// For a personal project/demo, putting VITE_GEMINI_API_KEY in .env is acceptable.
const ai = new GoogleGenAI({apiKey: import.meta.env.VITE_GEMINI_API_KEY});

const AIAnalysis = () => {
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }
    setIsLoading(true);
    setError("");
    setAiResponse("");

    try {
      // 1. Fetch financial data (Same as before)
      const [expensesRes, incomesRes] = await Promise.all([
        api.get(`/finance/expenses?size=100&sort=expenseDate,desc`),
        api.get(`/finance/incomes?size=100&sort=incomeDate,desc`),
      ]);

      // 2. Format Data (Same as before)
      const expenseData = expensesRes.data.content
        .map((e) => `${e.expenseDate} (${e.category}): $${e.amount.toFixed(2)}`)
        .join(", ");

      const incomeData = incomesRes.data.content
        .map((i) => `${i.incomeDate}: $${i.amount.toFixed(2)}`)
        .join(", ");

      // 3. Construct Prompt
      const prompt = `As a business analyst for a logistics company, answer this question: '${question}'. 
            Context Data:
            INCOMES: [${incomeData || "None"}]. 
            EXPENSES: [${expenseData || "None"}].
            Provide a concise, professional insight based strictly on this data.`;

      // 4. Call Gemini API
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });
      const text = response.text;

      setAiResponse(text);
    } catch (err) {
      setError(
        "Failed to analyze data. Please check your API key or try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the component (formatResponse, return statement) remains exactly the same ...
  const formatResponse = (text) => {
    if (!text) return null;
    return text
      .split("\n")
      .filter((p) => p.trim())
      .map((paragraph, index) => (
        <p key={index} className="mb-2">
          {paragraph}
        </p>
      ));
  };

  return (
    <div className="mt-8 rounded-sm border border-border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-bold uppercase tracking-tight text-foreground">
        AI Financial Analyst
      </h2>
      <p className="mt-1 text-xs font-mono text-muted-foreground uppercase tracking-wider">
        Analyze trends from the last 90 days
      </p>

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., Why were maintenance costs higher than fuel costs last month?"
          className="w-full rounded-sm border-input bg-transparent text-sm font-mono shadow-sm focus:ring-1 focus:ring-primary p-2"
          rows="3"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 rounded-sm bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-95"
        >
          {isLoading ? "Processing..." : "Execute Analysis"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-xs font-mono text-destructive uppercase">
          {error}
        </p>
      )}

      <div className="mt-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-border/50 rounded-sm">
            <Bot className="mb-4 h-8 w-8 animate-pulse text-primary" />
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Analyzing Dataset...
            </p>
          </div>
        )}

        {!isLoading && aiResponse && (
          <div className="prose prose-sm max-w-none rounded-sm border border-border bg-secondary/20 p-4 text-foreground font-mono text-xs leading-relaxed">
            {formatResponse(aiResponse)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;
