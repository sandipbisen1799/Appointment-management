import { EllipsisVertical } from "lucide-react";
import React from "react";
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : "-";
  }, obj);
};
function Table({ columns, data, renderActions, renderExtra ,renderExtraText , renderActionsText}) {
  return (
    <div className="w-full overflow-x-auto pb-20">
      <table className="min-w-[900px] w-full table-auto text-sm border-collapse rounded-lg  bg-white shadow-lg shadow-gray-200">
        <thead className="capitalize text-gray-600/70  font-semibold">
          <tr className="h-12">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}

            {renderActions && (
              <th className="px-4 py-2 text-left">{renderActionsText}</th>
            )}

            {renderExtra && (
              <th className="px-4 py-2 text-left">{renderExtraText}</th>
            )}
          </tr>
        </thead>

        <tbody className="capitalize text-gray-600/70 font-semibold">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (renderActions ? 1 : 0) + (renderExtra ? 1 : 0)}
                className="px-4 py-8 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row._id || index}
                className="h-12 border-t border-gray-200/40"
              >
                {columns.map((col) => (
                  <td key={col.key} className="text-sm px-4 py-2">
                    {col.render
                      ? col.render(row, index + 1)
                      : getNestedValue(row, col.key)}
                  </td>
                ))}
                {renderExtra && (
                  <td className="px-4 py-2">
                    {renderExtra(row)}
                  </td>
                )}
                {renderActions && (
                  <td className="px-4 py-2">
                    {renderActions(row)}
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
