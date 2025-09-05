import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const AllFinancesTable = ({ items, requestSort, sortConfig }) => {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">No Financial Records Found</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Add some incomes or expenses to see them here.
        </p>
      </div>
    );
  }

  const getSortIndicator = (key) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return <ArrowUpDown className="ml-2 inline h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              <button onClick={() => requestSort('date')} className="flex items-center">
                Date {getSortIndicator('date')}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Description
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
               <button onClick={() => requestSort('type')} className="flex items-center">
                Type {getSortIndicator('type')}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
               <button onClick={() => requestSort('amount')} className="flex items-center">
                Amount {getSortIndicator('amount')}
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {items.map((item, index) => (
            <tr key={`${item.type}-${item.id}-${index}`}>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{item.date}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.description}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                 <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${
                    item.type === 'INCOME' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                 }`}>
                    {item.type}
                 </span>
              </td>
              <td className={`whitespace-nowrap px-6 py-4 text-sm font-semibold ${
                  item.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.type === 'INCOME' ? '+' : '-'}${item.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllFinancesTable;