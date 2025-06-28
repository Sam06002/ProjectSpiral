import React, { createContext, useCallback, useContext, useState, ReactNode, useMemo } from 'react';
import { Snackbar, Alert, AlertColor, SnackbarOrigin, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

type Notification = {
  id: string;
  message: string;
  type: AlertColor;
  autoHideDuration?: number | null;
  anchorOrigin?: SnackbarOrigin;
  action?: React.ReactNode;
  onClose?: () => void;
  persist?: boolean;
};

type NotificationOptions = Omit<Notification, 'id' | 'message' | 'type'> & {
  type?: AlertColor;
};

type NotificationContextType = {
  showNotification: (message: string, options?: NotificationOptions) => void;
  showError: (message: string, options?: Omit<NotificationOptions, 'type'>) => void;
  showSuccess: (message: string, options?: Omit<NotificationOptions, 'type'>) => void;
  showWarning: (message: string, options?: Omit<NotificationOptions, 'type'>) => void;
  showInfo: (message: string, options?: Omit<NotificationOptions, 'type'>) => void;
  closeNotification: (id: string) => void;
  closeAllNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_AUTO_HIDE_DURATION = 6000; // 6 seconds
const DEFAULT_ANCHOR_ORIGIN: SnackbarOrigin = { vertical: 'bottom', horizontal: 'right' };

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(true);

  const showNotification = useCallback((message: string, options: NotificationOptions = {}) => {
    const id = Math.random().toString(36).substr(2, 9);
    const {
      type = 'info',
      autoHideDuration = DEFAULT_AUTO_HIDE_DURATION,
      anchorOrigin = DEFAULT_ANCHOR_ORIGIN,
      action,
      onClose,
      persist = false,
    } = options;

    setNotifications((prev) => [
      ...prev,
      {
        id,
        message,
        type,
        autoHideDuration: persist ? null : autoHideDuration,
        anchorOrigin,
        action,
        onClose,
        persist,
      },
    ]);

    setOpen(true);

    return id;
  }, []);

  const showError = useCallback(
    (message: string, options: Omit<NotificationOptions, 'type'> = {}) => {
      return showNotification(message, { ...options, type: 'error' });
    },
    [showNotification]
  );

  const showSuccess = useCallback(
    (message: string, options: Omit<NotificationOptions, 'type'> = {}) => {
      return showNotification(message, { ...options, type: 'success' });
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string, options: Omit<NotificationOptions, 'type'> = {}) => {
      return showNotification(message, { ...options, type: 'warning' });
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string, options: Omit<NotificationOptions, 'type'> = {}) => {
      return showNotification(message, { ...options, type: 'info' });
    },
    [showNotification]
  );

  const closeNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === id);
      if (notification?.onClose) {
        notification.onClose();
      }
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  const closeAllNotifications = useCallback(() => {
    setNotifications((prev) => {
      prev.forEach((notification) => {
        if (notification.onClose) {
          notification.onClose();
        }
      });
      return [];
    });
  }, []);

  const handleClose = useCallback(
    (id: string, event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        // Don't close on clickaway for persistent notifications
        const notification = notifications.find((n) => n.id === id);
        if (notification?.persist) {
          return;
        }
      }
      closeNotification(id);
    },
    [closeNotification, notifications]
  );

  const value = useMemo(
    () => ({
      showNotification,
      showError,
      showSuccess,
      showWarning,
      showInfo,
      closeNotification,
      closeAllNotifications,
    }),
    [showNotification, showError, showSuccess, showWarning, showInfo, closeNotification, closeAllNotifications]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={open}
          autoHideDuration={notification.autoHideDuration}
          onClose={(event, reason) => handleClose(notification.id, event, reason)}
          anchorOrigin={notification.anchorOrigin}
          sx={{ maxWidth: '100%' }}
          ClickAwayListenerProps={{ mouseEvent: false, touchEvent: false }}
        >
          <Alert
            severity={notification.type}
            variant="filled"
            onClose={() => handleClose(notification.id)}
            action={
              <>
                {notification.action}
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => handleClose(notification.id)}
                  sx={{ ml: 1 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </>
            }
            sx={{
              width: '100%',
              maxWidth: 400,
              '& .MuiAlert-message': {
                flexGrow: 1,
                wordBreak: 'break-word',
              },
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationProvider;
