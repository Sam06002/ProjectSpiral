import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Backdrop, 
  Typography, 
  Fade,
  LinearProgress,
  SxProps,
  Theme,
  useTheme
} from '@mui/material';

type LoadingVariant = 'circular' | 'linear' | 'fullscreen' | 'overlay';

type LoadingProps = {
  /**
   * The loading variant to use
   * @default 'circular'
   */
  variant?: LoadingVariant;
  
  /**
   * The size of the loading indicator
   * @default 40
   */
  size?: number | string;
  
  /**
   * The thickness of the loading indicator
   * @default 3.6
   */
  thickness?: number;
  
  /**
   * The color of the loading indicator
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
  
  /**
   * The loading text to display
   */
  text?: string;
  
  /**
   * The position of the text relative to the loading indicator
   * @default 'bottom'
   */
  textPosition?: 'top' | 'bottom' | 'left' | 'right';
  
  /**
   * Whether to show the loading indicator
   * @default true
   */
  loading?: boolean;
  
  /**
   * The opacity of the overlay when variant is 'overlay' or 'fullscreen'
   * @default 0.5
   */
  opacity?: number;
  
  /**
   * The z-index of the loading component
   * @default 1300 (same as MUI's Modal)
   */
  zIndex?: number;
  
  /**
   * Additional styles
   */
  sx?: SxProps<Theme>;
  
  /**
   * Class name for the root element
   */
  className?: string;
  
  /**
   * Whether to show a backdrop when variant is 'overlay' or 'fullscreen'
   * @default true
   */
  showBackdrop?: boolean;
  
  /**
   * The transition duration in milliseconds
   * @default 500
   */
  transitionDuration?: number;
};

/**
 * A flexible loading indicator component with multiple variants
 */
const Loading: React.FC<LoadingProps> = ({
  variant = 'circular',
  size = 40,
  thickness = 3.6,
  color = 'primary',
  text,
  textPosition = 'bottom',
  loading = true,
  opacity = 0.5,
  zIndex = 1300,
  sx = {},
  className = '',
  showBackdrop = true,
  transitionDuration = 500,
}) => {
  const theme = useTheme();
  
  if (!loading) return null;
  
  const renderLoadingContent = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: (() => {
          switch (textPosition) {
            case 'top': return 'column-reverse';
            case 'left': return 'row-reverse';
            case 'right': return 'row';
            case 'bottom':
            default:
              return 'column';
          }
        })(),
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        ...(variant === 'circular' && {
          p: 2,
        }),
        ...(variant === 'linear' && {
          width: '100%',
        }),
        ...(typeof sx === 'function' ? sx(theme) : sx),
      }}
      className={`loading-indicator ${className}`}
    >
      {variant === 'circular' && (
        <CircularProgress
          size={size}
          thickness={thickness}
          color={color}
          sx={{ flexShrink: 0 }}
        />
      )}
      
      {variant === 'linear' && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress 
            color={color} 
            sx={{ 
              height: thickness,
              borderRadius: thickness / 2,
            }} 
          />
        </Box>
      )}
      
      {text && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            textAlign: 'center',
            ...(variant === 'linear' && {
              mt: 0.5,
            }),
          }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );

  if (variant === 'fullscreen' || variant === 'overlay') {
    return (
      <Fade in={loading} timeout={transitionDuration}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex,
            ...(variant === 'overlay' && {
              backgroundColor: `rgba(0, 0, 0, ${opacity})`,
              backdropFilter: 'blur(2px)',
            }),
            ...(variant === 'fullscreen' && {
              backgroundColor: theme.palette.background.default,
            }),
          }}
        >
          {showBackdrop && variant === 'overlay' && (
            <Backdrop
              sx={{
                position: 'absolute',
                zIndex: -1,
                backgroundColor: 'transparent',
              }}
              open={true}
              invisible
            />
          )}
          {renderLoadingContent()}
        </Box>
      </Fade>
    );
  }

  return renderLoadingContent();
};

export default Loading;
