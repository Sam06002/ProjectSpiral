import React, { useState, useMemo, useCallback } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Checkbox,
  IconButton,
  Tooltip,
  Box,
  Typography,
  CircularProgress,
  TableFooter,
  LinearProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  useTheme,
} from '@mui/material';
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import { useDebounce } from 'use-debounce';

type Order = 'asc' | 'desc';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

interface Action {
  label: string;
  icon: React.ReactNode;
  onClick: (id: string) => void;
  color?: 'inherit' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  disabled?: boolean;
  divider?: boolean;
}

interface Column<T> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
  format?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  filterComponent?: React.ReactNode;
  renderCell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    page: number;
    rowsPerPage: number;
    totalRows: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rowsPerPage: number) => void;
    rowsPerPageOptions?: number[];
  };
  sorting?: {
    orderBy: string;
    order: Order;
    onSort: (orderBy: string, order: Order) => void;
  };
  selection?: {
    selected: string[];
    onSelect: (selected: string[]) => void;
    getRowId: (row: T) => string;
    selectAll?: boolean;
  };
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounce?: number;
  };
  actions?: {
    view?: (id: string) => void;
    edit?: (id: string) => void;
    delete?: (id: string) => void;
    custom?: Action[];
  };
  noDataText?: string;
  noResultsText?: string;
  showToolbar?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  stickyHeader?: boolean;
  height?: number | string;
  sx?: object;
}

function DataTable<T>({
  columns,
  data,
  loading = false,
  pagination,
  sorting,
  selection,
  search,
  actions,
  noDataText = 'No data available',
  noResultsText = 'No results found',
  showToolbar = true,
  showHeader = true,
  showFooter = true,
  stickyHeader = false,
  height = 'auto',
  sx = {},
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState(search?.value || '');
  const [debouncedSearch] = useDebounce(searchValue, search?.debounce || 300);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  const handleRequestSort = (property: string) => {
    if (!sorting) return;
    
    const isAsc = sorting.orderBy === property && sorting.order === 'asc';
    sorting.onSort(property, isAsc ? 'desc' : 'asc');
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selection) return;
    
    if (event.target.checked) {
      const newSelected = data.map(selection.getRowId);
      selection.onSelect(newSelected);
      return;
    }
    selection.onSelect([]);
  };

  const handleSelectClick = (event: React.MouseEvent<unknown>, id: string) => {
    if (!selection) return;
    
    event.stopPropagation();
    
    const selectedIndex = selection.selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selection.selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selection.selected.slice(1));
    } else if (selectedIndex === selection.selected.length - 1) {
      newSelected = newSelected.concat(selection.selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selection.selected.slice(0, selectedIndex),
        selection.selected.slice(selectedIndex + 1),
      );
    }

    selection.onSelect(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    if (pagination) {
      pagination.onPageChange(newPage);
    }
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (pagination) {
      pagination.onRowsPerPageChange(parseInt(event.target.value, 10));
      pagination.onPageChange(0);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    
    if (search?.onChange) {
      search.onChange(value);
    }
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, row: T) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleActionMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleActionClick = (action: (id: string) => void) => {
    if (selectedRow && selection) {
      const id = selection.getRowId(selectedRow);
      action(id);
      handleActionMenuClose();
    }
  };

  const isSelected = (id: string) => {
    return selection ? selection.selected.indexOf(id) !== -1 : false;
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = pagination
    ? Math.max(0, pagination.rowsPerPage - data.length)
    : 0;

  // Get the row ID for the current row
  const getRowId = useCallback((row: T) => {
    return selection ? selection.getRowId(row) : '';
  }, [selection]);

  // Get the actions to display in the actions menu
  const actionItems = useMemo(() => {
    const items: Action[] = [];
    
    if (actions?.view) {
      items.push({
        label: 'View',
        icon: <VisibilityIcon fontSize="small" />,
        onClick: actions.view,
        color: 'primary',
      });
    }
    
    if (actions?.edit) {
      items.push({
        label: 'Edit',
        icon: <EditIcon fontSize="small" />,
        onClick: actions.edit,
        color: 'primary',
      });
    }
    
    if (actions?.delete) {
      items.push({
        label: 'Delete',
        icon: <DeleteIcon fontSize="small" />,
        onClick: actions.delete,
        color: 'error',
      });
    }
    
    if (actions?.custom) {
      items.push(...actions.custom);
    }
    
    return items;
  }, [actions]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', ...sx }}>
      {/* Toolbar with search and actions */}
      {showToolbar && (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {search && (
            <TextField
              size="small"
              placeholder={search.placeholder || 'Search...'}
              value={searchValue}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
          )}
          
          <Box>
            {selection && selection.selected.length > 0 && (
              <Typography color="text.secondary" sx={{ mr: 2 }}>
                {selection.selected.length} selected
              </Typography>
            )}
            
            {actions && (
              <Tooltip title="Filter list">
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      )}
      
      {/* Loading indicator */}
      {loading && <LinearProgress />}
      
      {/* Table */}
      <TableContainer sx={{ maxHeight: height, minHeight: 200 }}>
        <Table stickyHeader={stickyHeader} size="small">
          {showHeader && (
            <TableHead>
              <TableRow>
                {selection && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selection.selected.length > 0 && 
                        selection.selected.length < data.length
                      }
                      checked={
                        data.length > 0 && 
                        selection.selected.length === data.length
                      }
                      onChange={handleSelectAllClick}
                      inputProps={{ 'aria-label': 'select all' }}
                      disabled={loading}
                    />
                  </TableCell>
                )}
                
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                    sortDirection={sorting?.orderBy === column.id ? sorting.order : false}
                  >
                    {sorting && column.sortable ? (
                      <TableSortLabel
                        active={sorting.orderBy === column.id}
                        direction={sorting.orderBy === column.id ? sorting.order : 'asc'}
                        onClick={() => handleRequestSort(column.id)}
                      >
                        {column.label}
                        {sorting.orderBy === column.id ? (
                          <Box component="span" sx={visuallyHidden}>
                            {sorting.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                    
                    {column.filterable && column.filterComponent && (
                      <Box display="inline-block" ml={1}>
                        {column.filterComponent}
                      </Box>
                    )}
                  </TableCell>
                ))}
                
                {actions && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
          )}
          
          <TableBody>
            {loading && data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selection ? 1 : 0) + (actions ? 1 : 0)} align="center">
                  <Box p={3}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Loading data...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selection ? 1 : 0) + (actions ? 1 : 0)} align="center">
                  <Box p={3}>
                    <Typography variant="body1" color="text.secondary">
                      {search?.value ? noResultsText : noDataText}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => {
                const rowId = getRowId(row);
                const isItemSelected = isSelected(rowId);
                const labelId = `enhanced-table-checkbox-${rowIndex}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={rowId}
                    selected={isItemSelected}
                    onClick={(event) => selection?.onSelect([rowId])}
                    sx={{ cursor: 'pointer' }}
                  >
                    {selection && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleSelectClick(event, rowId);
                          }}
                        />
                      </TableCell>
                    )}
                    
                    {columns.map((column) => {
                      const value = (row as any)[column.id];
                      
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.renderCell 
                            ? column.renderCell(row) 
                            : column.format 
                              ? column.format(value, row)
                              : value}
                        </TableCell>
                      );
                    })}
                    
                    {actions && (
                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionMenuOpen(e, row)}
                          aria-label="actions"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
            
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={columns.length + (selection ? 1 : 0) + (actions ? 1 : 0)} />
              </TableRow>
            )}
          </TableBody>
          
          {showFooter && pagination && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={pagination.rowsPerPageOptions || [5, 10, 25, 50, 100]}
                  colSpan={columns.length + (selection ? 1 : 0) + (actions ? 1 : 0)}
                  count={pagination.totalRows}
                  rowsPerPage={pagination.rowsPerPage}
                  page={pagination.page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </TableContainer>
      
      {/* Actions menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionMenuClose}
        onClick={handleActionMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 180,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {actionItems.map((action, index) => (
          <React.Fragment key={index}>
            {action.divider && <Divider />}
            <MenuItem 
              onClick={() => handleActionClick(action.onClick)}
              disabled={action.disabled}
              sx={{ color: action.color ? `${action.color}.main` : 'inherit' }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {action.icon}
              </ListItemIcon>
              <ListItemText>{action.label}</ListItemText>
            </MenuItem>
          </React.Fragment>
        ))}
      </Menu>
    </Paper>
  );
}

export default DataTable;
