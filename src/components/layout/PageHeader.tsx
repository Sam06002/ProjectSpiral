import React, { ReactNode } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Divider, 
  IconButton, 
  Tooltip, 
  Breadcrumbs, 
  Link, 
  SxProps, 
  Theme,
  useTheme,
  Paper,
  Stack,
  alpha
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Refresh as RefreshIcon, 
  Add as AddIcon, 
  MoreVert as MoreVertIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';

interface BreadcrumbItem {
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
}

type Action = {
  /**
   * The label of the action button
   */
  label?: string;
  
  /**
   * The icon to display in the action button
   */
  icon?: ReactNode;
  
  /**
   * The variant of the button
   * @default 'contained'
   */
  variant?: 'text' | 'outlined' | 'contained';
  
  /**
   * The color of the button
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
  
  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * The type of the button
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  
  /**
   * The tooltip text to display on hover
   */
  tooltip?: string;
  
  /**
   * The click handler for the action
   */
  onClick?: () => void;
  
  /**
   * Additional styles
   */
  sx?: SxProps<Theme>;
  
  /**
   * Whether to show a loading state
   * @default false
   */
  loading?: boolean;
};

type PageHeaderProps = {
  /**
   * The main title of the page
   */
  title: string;
  
  /**
   * The subtitle or description of the page
   */
  subtitle?: string;
  
  /**
   * The breadcrumb items to display
   */
  breadcrumbs?: BreadcrumbItem[];
  
  /**
   * Whether to show the back button
   * @default false
   */
  showBackButton?: boolean;
  
  /**
   * The click handler for the back button
   */
  onBackClick?: () => void;
  
  /**
   * Whether to show the refresh button
   * @default false
   */
  showRefreshButton?: boolean;
  
  /**
   * The click handler for the refresh button
   */
  onRefreshClick?: () => void;
  
  /**
   * The primary action button configuration
   */
  primaryAction?: Action;
  
  /**
   * The secondary action buttons configuration
   */
  secondaryActions?: Action[];
  
  /**
   * Whether to show a divider below the header
   * @default true
   */
  divider?: boolean;
  
  /**
   * Additional styles for the header
   */
  sx?: SxProps<Theme>;
  
  /**
   * The maximum width of the header content
   * @default '100%'
   */
  maxWidth?: string | number;
  
  /**
   * The variant of the header
   * @default 'default'
   */
  variant?: 'default' | 'elevation' | 'outlined' | 'gradient';
  
  /**
   * The elevation of the header (only applies when variant is 'elevation')
   * @default 1
   */
  elevation?: number;
  
  /**
   * The padding of the header
   * @default { xs: 2, sm: 3 }
   */
  padding?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  
  /**
   * The background color of the header
   */
  backgroundColor?: string;
  
  /**
   * The text color of the title
   */
  titleColor?: string;
  
  /**
   * The text color of the subtitle
   */
  subtitleColor?: string;
  
  /**
   * Additional content to render in the header
   */
  children?: ReactNode;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs = [],
  showBackButton = false,
  onBackClick,
  showRefreshButton = false,
  onRefreshClick,
  primaryAction,
  secondaryActions = [],
  divider = true,
  sx = {},
  maxWidth = '100%',
  variant = 'default',
  elevation = 1,
  padding = { xs: 2, sm: 3 },
  backgroundColor,
  titleColor,
  subtitleColor,
  children,
}) => {
  const theme = useTheme();
  
  // Handle back button click
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };
  
  // Handle refresh button click
  const handleRefreshClick = () => {
    if (onRefreshClick) {
      onRefreshClick();
    } else {
      window.location.reload();
    }
  };
  
  // Default padding
  const getPadding = () => {
    if (typeof padding === 'number') {
      return padding;
    }
    
    return {
      xs: padding.xs || 2,
      sm: padding.sm || 3,
      md: padding.md || padding.sm || 3,
      lg: padding.lg || padding.md || padding.sm || 3,
      xl: padding.xl || padding.lg || padding.md || padding.sm || 3,
    };
  };
  
  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    if (breadcrumbs.length === 0 && !showBackButton && !showRefreshButton) {
      return null;
    }
    
    const items: ReactNode[] = [];
    
    // Add home breadcrumb
    items.push(
      <Link
        key="home"
        color="inherit"
        href="/"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = '/';
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        <HomeIcon sx={{ fontSize: 16, mr: 0.5 }} />
        Home
      </Link>
    );
    
    // Add custom breadcrumbs
    breadcrumbs.forEach((item, index) => {
      items.push(
        <Link
          key={index}
          color="inherit"
          href={item.href || '#'}
          onClick={(e) => {
            if (item.onClick) {
              e.preventDefault();
              item.onClick();
            }
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {item.icon && <Box component="span" sx={{ display: 'inline-flex', mr: 0.5 }}>{item.icon}</Box>}
          {item.label}
        </Link>
      );
    });
    
    return (
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        sx={{ mb: 1, '& .MuiBreadcrumbs-separator': { mx: 0.5 } }}
      >
        {items}
      </Breadcrumbs>
    );
  };
  
  // Render action buttons
  const renderActions = () => {
    const buttons: ReactNode[] = [];
    
    // Add secondary actions
    secondaryActions.forEach((action, index) => {
      const button = (
        <Button
          key={`secondary-${index}`}
          variant={action.variant || 'outlined'}
          color={action.color || 'primary'}
          disabled={action.disabled || action.loading}
          startIcon={action.icon}
          onClick={action.onClick}
          type={action.type || 'button'}
          sx={{
            whiteSpace: 'nowrap',
            ...(action.sx as object),
          }}
        >
          {action.loading ? 'Loading...' : action.label}
        </Button>
      );
      
      if (action.tooltip) {
        buttons.push(
          <Tooltip key={`tooltip-${index}`} title={action.tooltip}>
            <span>{button}</span>
          </Tooltip>
        );
      } else {
        buttons.push(button);
      }
    });
    
    // Add primary action
    if (primaryAction) {
      const button = (
        <Button
          key="primary"
          variant={primaryAction.variant || 'contained'}
          color={primaryAction.color || 'primary'}
          disabled={primaryAction.disabled || primaryAction.loading}
          startIcon={primaryAction.icon}
          onClick={primaryAction.onClick}
          type={primaryAction.type || 'button'}
          sx={{
            ml: 1,
            whiteSpace: 'nowrap',
            ...(primaryAction.sx as object),
          }}
        >
          {primaryAction.loading ? 'Loading...' : primaryAction.label}
        </Button>
      );
      
      if (primaryAction.tooltip) {
        buttons.push(
          <Tooltip key="primary-tooltip" title={primaryAction.tooltip}>
            <span>{button}</span>
          </Tooltip>
        );
      } else {
        buttons.push(button);
      }
    }
    
    return buttons.length > 0 ? (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: { xs: 2, sm: 0 } }}>
        {buttons}
      </Box>
    ) : null;
  };
  
  // Header content
  const headerContent = (
    <Box
      sx={{
        width: '100%',
        maxWidth: maxWidth,
        mx: 'auto',
        px: getPadding(),
        py: typeof getPadding() === 'number' ? getPadding() : undefined,
        ...(variant === 'elevation' && {
          backgroundColor: theme.palette.background.paper,
          borderRadius: 1,
          boxShadow: theme.shadows[elevation],
        }),
        ...(variant === 'outlined' && {
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
        }),
        ...(variant === 'gradient' && {
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: theme.palette.primary.contrastText,
          borderRadius: 1,
        }),
        ...(backgroundColor && { backgroundColor }),
        ...(typeof sx === 'function' ? sx(theme) : sx),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            {(showBackButton || showRefreshButton) && (
              <Box sx={{ display: 'flex', mr: 1 }}>
                {showBackButton && (
                  <Tooltip title="Go back">
                    <IconButton 
                      onClick={handleBackClick}
                      size="small"
                      sx={{
                        mr: 1,
                        ...(variant === 'gradient' && {
                          color: 'inherit',
                          backgroundColor: alpha(theme.palette.common.white, 0.1),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.common.white, 0.2),
                          },
                        }),
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {showRefreshButton && (
                  <Tooltip title="Refresh">
                    <IconButton 
                      onClick={handleRefreshClick}
                      size="small"
                      sx={{
                        ...(variant === 'gradient' && {
                          color: 'inherit',
                          backgroundColor: alpha(theme.palette.common.white, 0.1),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.common.white, 0.2),
                          },
                        }),
                      }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}
            
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                lineHeight: 1.2,
                color: titleColor || (variant === 'gradient' ? 'inherit' : 'text.primary'),
                ...(variant === 'gradient' && {
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }),
              }}
              noWrap
            >
              {title}
            </Typography>
          </Box>
          
          {renderBreadcrumbs()}
          
          {subtitle && (
            <Typography
              variant="subtitle1"
              sx={{
                mt: 0.5,
                color: subtitleColor || (variant === 'gradient' 
                  ? alpha(theme.palette.common.white, 0.9) 
                  : 'text.secondary'),
                ...(variant === 'gradient' && {
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }),
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {renderActions()}
      </Box>
      
      {children && (
        <Box sx={{ mt: 2 }}>
          {children}
        </Box>
      )}
    </Box>
  );
  
  // Render with or without divider
  return (
    <>
      {variant === 'gradient' ? (
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 3, 
            overflow: 'hidden',
            background: 'transparent',
            ...(typeof sx === 'function' ? sx(theme) : sx),
          }}
        >
          {headerContent}
          {divider && (
            <Box 
              sx={{ 
                height: 4, 
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                opacity: 0.8,
              }} 
            />
          )}
        </Paper>
      ) : (
        <Box sx={{ mb: 3 }}>
          {headerContent}
          {divider && <Divider sx={{ mt: 2 }} />}
        </Box>
      )}
    </>
  );
};

export default PageHeader;
