import React, { useState } from 'react';
import axios from 'axios'; // Import the main axios library
import api from '../services/api'; // We still need this for our own backend
import { Bot, AlertTriangle } from 'lucide-react';

const AIAnalysis = () => {
    const [question, setQuestion] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) {
            setError('Please enter a question.');
            return;
        }
        setIsLoading(true);
        setError('');
        setAiResponse('');

        try {
            // 1. Fetch financial data directly from our backend
            const [expensesRes, incomesRes] = await Promise.all([
                api.get(`/finance/expenses?size=100&sort=expenseDate,desc`),
                api.get(`/finance/incomes?size=100&sort=incomeDate,desc`)
            ]);

            // 2. Format the data into strings for the prompt
            const expenseData = expensesRes.data.content
                .map(e => `${e.expenseDate} (${e.category}): $${e.amount.toFixed(2)}`)
                .join(', ');

            const incomeData = incomesRes.data.content
                .map(i => `${i.incomeDate}: $${i.amount.toFixed(2)}`)
                .join(', ');

            // 3. Construct the detailed prompt
            const prompt = `As a business analyst for a logistics company, answer the following question based on the provided financial data from the last 90 days. Provide a concise, insightful answer. Question: '${question}'. Here is the data: INCOMES: [${incomeData || 'None'}]. EXPENSES: [${expenseData || 'None'}].`;
            
            // 4. Call the external AI service directly
            const aiServiceUrl = "https://text.pollinations.ai";
            const fullUrl = `${aiServiceUrl}/${encodeURIComponent(prompt)}`;
            
            // Use a new axios instance for the external call to avoid sending our auth token
            const externalApiResponse = await axios.get(fullUrl);

            setAiResponse(externalApiResponse.data);

        } catch (err) {
            setError('Failed to get a response from the AI service. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatResponse = (text) => {
        if (!text) return null;
        return text.split('\n').filter(p => p.trim()).map((paragraph, index) => (
          <p key={index} className="mb-2">
            {paragraph}
          </p>
        ));
      };

    return (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI-Powered Financial Analyst</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Ask a question about the last 90 days of financial data. The AI will analyze the trends and provide an insight.
            </p>

            <form onSubmit={handleSubmit} className="mt-4">
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., Why were maintenance costs higher than fuel costs last month?"
                    className="w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    rows="3"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading ? 'Analyzing...' : 'Ask AI'}
                </button>
            </form>

            {error && <p className="mt-4 text-center text-red-500">{error}</p>}

            <div className="mt-6">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                        <Bot className="mb-4 h-10 w-10 animate-pulse text-blue-500" />
                        <p className="font-semibold">AI is analyzing financial data...</p>
                        <p className="text-sm text-gray-500">This may take a moment.</p>
                    </div>
                )}
                
                {!isLoading && aiResponse && (
                    <div className="prose prose-sm max-w-none rounded-lg border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50 dark:prose-invert">
                        {formatResponse(aiResponse)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIAnalysis;