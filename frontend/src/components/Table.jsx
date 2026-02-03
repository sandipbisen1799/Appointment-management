import React from "react";

function Table({ columns, data, renderActions, renderExtra }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl bg-white shadow-md">
      <table className="min-w-[900px] w-full border-collapse">
        
        {/* TABLE HEAD */}
        <thead className="sticky top-0 bg-gray-100 text-gray-700 text-sm">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-5 py-3 text-left font-semibold tracking-wide"
              >
                {col.label}
              </th>
            ))}

            {renderActions && (
              <th className="px-5 py-3 text-left font-semibold">
                Actions
              </th>
            )}

            {renderExtra && (
              <th className="px-5 py-3 text-left font-semibold">
                Unblock
              </th>
            )}
          </tr>
        </thead>

        {/* TABLE BODY */}
        <tbody className="text-sm text-gray-600">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={
                  columns.length +
                  (renderActions ? 1 : 0) +
                  (renderExtra ? 1 : 0)
                }
                className="text-center py-10 text-gray-400"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row._id || index}
                className="
                  border-b last:border-b-0
                  hover:bg-gray-50
                  transition-colors
                  even:bg-gray-50/40
                "
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3 whitespace-nowrap">
                    {col.render
                      ? col.render(row, index + 1)
                      : row[col.key]}
                  </td>
                ))}

                {renderActions && (
                  <td className="px-5 py-3">
                    {renderActions(row)}
                  </td>
                )}

                {renderExtra && (
                  <td className="px-5 py-3">
                    {renderExtra(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
