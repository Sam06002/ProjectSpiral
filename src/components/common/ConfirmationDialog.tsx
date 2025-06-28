import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  IconButton,
  Typography,
  useTheme,
  SxProps,
  Theme,
} from '@mui/material';
import { Close as CloseIcon, Warning as WarningIcon, Error as ErrorIcon, Info as InfoIcon, CheckCircle as SuccessIcon } from '@mui/icons-material';

type DialogType = 'warning' | 'error' | 'info' | 'success' | 'confirm';

type ConfirmationDialogProps = {
  open: boolean;
  title?: string;
  message: string | React.ReactNode;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  showCancelButton?: boolean;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  confirmButtonColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  cancelButtonColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  confirmButtonVariant?: 'text' | 'outlined' | 'contained';
  cancelButtonVariant?: 'text' | 'outlined' | 'contained';
  iconSize?: 'small' | 'medium' | 'large' | number;
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  actionsSx?: SxProps<Theme>;
  hideIcon?: boolean;
  children?: React.ReactNode;
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  message,
  type = 'confirm',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  onClose,
  maxWidth = 'sm',
  fullWidth = true,
  showCancelButton = true,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  confirmButtonColor = 'primary',
  cancelButtonColor = 'inherit',
  confirmButtonVariant = 'contained',
  cancelButtonVariant = 'text',
  iconSize = 'large',
  sx = {},
  contentSx = {},
  actionsSx = {},
  hideIcon = false,
  children,
}) => {
  const theme = useTheme();

  const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (
      (reason === 'backdropClick' && disableBackdropClick) ||
      (reason === 'escapeKeyDown' && disableEscapeKeyDown)
    ) {
      return;
    }
    
    if (onClose) {
      onClose();
    } else {
      onCancel();
    }
  };

  const getIcon = () => {
    if (hideIcon) return null;
    
    const iconProps = {
      fontSize: typeof iconSize === 'string' ? iconSize : undefined,
      style: typeof iconSize === 'number' ? { fontSize: iconSize } : undefined,
    };

    switch (type) {
      case 'warning':
        return <WarningIcon color="warning" {...iconProps} />;
      case 'error':
        return <ErrorIcon color="error" {...iconProps} />;
      case 'info':
        return <InfoIcon color="info" {...iconProps} />;
      case 'success':
        return <SuccessIcon color="success" {...iconProps} />;
      case 'confirm':
      default:
        return <WarningIcon color="warning" {...iconProps} />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    
    switch (type) {
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      case 'info':
        return 'Information';
      case 'success':
        return 'Success';
      case 'confirm':
      default:
        return 'Are you sure?';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      disableEscapeKeyDown={disableEscapeKeyDown}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          ...(typeof sx === 'function' ? sx(theme) : sx),
        },
      }}
    >
      <DialogTitle id="confirmation-dialog-title" sx={{ pb: 1, display: 'flex', alignItems: 'center' }}>
        {!hideIcon && (
          <Box mr={1.5} display="flex" alignItems="center">
            {getIcon()}
          </Box>
        )}
        {getTitle()}
        <IconButton
          aria-label="close"
          onClick={onCancel}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ ...(typeof contentSx === 'function' ? contentSx(theme) : contentSx) }}>
        {typeof message === 'string' ? (
          <DialogContentText id="confirmation-dialog-description" color="textPrimary">
            {message}
          </DialogContentText>
        ) : (
          <Box py={1}>{message}</Box>
        )}
        {children}
      </DialogContent>
      
      <DialogActions 
        sx={{
          px: 3,
          py: 2,
          ...(typeof actionsSx === 'function' ? actionsSx(theme) : actionsSx),
        }}
      >
        {showCancelButton && (
          <Button 
            onClick={onCancel}
            color={cancelButtonColor}
            variant={cancelButtonVariant}
            sx={{ minWidth: 100 }}
          >
            {cancelText}
          </Button>
        )}
        <Button
          onClick={onConfirm}
          color={confirmButtonColor}
          variant={confirmButtonVariant}
          autoFocus
          sx={{ minWidth: 100 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
