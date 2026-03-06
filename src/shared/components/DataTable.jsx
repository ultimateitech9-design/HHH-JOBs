const DataTable = ({ columns, rows }) => {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty-cell">
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={row.id || row.key || index}>
                {columns.map((column) => (
                  <td key={`${column.key}-${row.id || index}`}>
                    {typeof column.render === 'function'
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
