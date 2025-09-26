import { Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function GenericDataTable({
  columns,
  rows,
  onEdit,
  onDelete,
  sx,
  headerSx,
  cellSx,
  headerAlign = 'left',
  cellAlign = 'left',
  dense = false,
  bordered = false,
}) {
  const paperSx = {
    overflowX: 'auto',
    ...(sx || {}),
  };
  const headCellSx = {
    fontWeight: 600,
    ...(bordered ? { borderBottom: (theme) => `1px solid ${theme.palette.divider}` } : {}),
    ...(headerSx || {}),
  };
  const bodyCellSx = {
    ...(bordered ? { borderBottom: (theme) => `1px solid ${theme.palette.divider}` } : {}),
    ...(cellSx || {}),
  };

  return (
    <Paper sx={paperSx}>
      <Table size={dense ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.field} align={col.headerAlign || headerAlign} sx={headCellSx}>
                {col.headerName}
              </TableCell>
            ))}
            {(onEdit || onDelete) && (
              <TableCell align={headerAlign} sx={headCellSx}>Actions</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((col) => (
                <TableCell key={col.field} align={col.align || cellAlign} sx={bodyCellSx}>
                  {col.renderCell ? col.renderCell(row) : row[col.field]}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell align={cellAlign} sx={bodyCellSx}>
                  {onEdit && (
                    <IconButton onClick={() => onEdit(row)} size="small">
                      <EditIcon />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton onClick={() => onDelete(row)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}