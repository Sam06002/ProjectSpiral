import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Divider,
  FormGroup,
  Switch,
  Slider,
  Rating,
  Autocomplete,
  Chip,
  CircularProgress,
  useTheme,
  SxProps,
  Theme,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { DatePicker, DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Controller, useForm, UseFormReturn, FieldValues, SubmitHandler, UseFormProps } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format, parseISO } from 'date-fns';

// Types
type FieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'autocomplete'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'rating'
  | 'slider'
  | 'hidden';

type Option = {
  label: string;
  value: any;
  disabled?: boolean;
};

type Field = {
  name: string;
  label?: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  options?: Option[] | (() => Promise<Option[]>);
  multiple?: boolean;
  defaultValue?: any;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  gridProps?: {
    xs?: number | 'auto' | boolean;
    sm?: number | 'auto' | boolean;
    md?: number | 'auto' | boolean;
    lg?: number | 'auto' | boolean;
    xl?: number | 'auto' | boolean;
  };
  textFieldProps?: any;
  selectProps?: any;
  autocompleteProps?: any;
  checkboxProps?: any;
  radioProps?: any;
  sliderProps?: any;
  datePickerProps?: any;
  timePickerProps?: any;
  dateTimePickerProps?: any;
  ratingProps?: any;
  validation?: yup.AnySchema;
  render?: (props: {
    field: any;
    fieldState: any;
    formState: any;
    methods: UseFormReturn<FieldValues>;
  }) => React.ReactNode;
};

type FormAction = {
  label: string;
  type?: 'submit' | 'reset' | 'button';
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  onClick?: (methods: UseFormReturn<FieldValues>) => void;
  sx?: SxProps<Theme>;
};

type FormProps = {
  fields: Field[];
  onSubmit: SubmitHandler<FieldValues>;
  actions?: FormAction[];
  defaultValues?: Record<string, any>;
  validationSchema?: yup.AnyObjectSchema;
  formProps?: UseFormProps;
  loading?: boolean;
  submitButtonText?: string;
  submitButtonProps?: any;
  resetButtonText?: string;
  resetButtonProps?: any;
  gridSpacing?: number;
  sx?: SxProps<Theme>;
  paperProps?: any;
  title?: string;
  subtitle?: string;
  showDivider?: boolean;
  debug?: boolean;
};

// Helper component for file upload
const FileUpload = ({
  field,
  fieldState,
  formState,
  onChange,
  multiple = false,
  accept,
  buttonText = 'Choose File',
  helperText,
  disabled,
}: {
  field: any;
  fieldState: any;
  formState: any;
  onChange: (files: FileList | null) => void;
  multiple?: boolean;
  accept?: string;
  buttonText?: string;
  helperText?: string;
  disabled?: boolean;
}) => {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const names = Array.from(files).map((file) => file.name);
      setFileNames(names);
      onChange(files);
    }
  };

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <Box>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        multiple={multiple}
        accept={accept}
        style={{ display: 'none' }}
        disabled={disabled}
      />
      <Box display="flex" alignItems="center" gap={2}>
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
          onClick={handleButtonClick}
          disabled={disabled}
        >
          {buttonText}
        </Button>
        {fileNames.length > 0 ? (
          <Typography variant="body2">
            {fileNames.length === 1 ? fileNames[0] : `${fileNames.length} files selected`}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No file chosen
          </Typography>
        )}
      </Box>
      {fieldState.error && (
        <FormHelperText error>{fieldState.error.message}</FormHelperText>
      )}
      {helperText && !fieldState.error && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
    </Box>
  );
};

// Main FormBuilder component
const FormBuilder: React.FC<FormProps> = ({
  fields,
  onSubmit,
  actions = [],
  defaultValues = {},
  validationSchema,
  formProps = {},
  loading = false,
  submitButtonText = 'Submit',
  submitButtonProps = {},
  resetButtonText = 'Reset',
  resetButtonProps = {},
  gridSpacing = 2,
  sx = {},
  paperProps = {},
  title,
  subtitle,
  showDivider = true,
  debug = false,
}) => {
  const theme = useTheme();
  const methods = useForm({
    defaultValues,
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
    ...formProps,
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = methods;

  // Handle form submission
  const handleFormSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Set default values when they change
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  // Render form field based on type
  const renderField = (field: Field) => {
    const {
      name,
      label,
      type = 'text',
      placeholder,
      required = false,
      disabled = false,
      hidden = false,
      fullWidth = true,
      multiline,
      rows,
      options = [],
      multiple = false,
      helperText,
      startAdornment,
      endAdornment,
      textFieldProps = {},
      selectProps = {},
      autocompleteProps = {},
      checkboxProps = {},
      radioProps = {},
      sliderProps = {},
      datePickerProps = {},
      timePickerProps = {},
      dateTimePickerProps = {},
      ratingProps = {},
      render,
    } = field;

    const error = errors[name];
    const fieldValue = watch(name);

    // Handle async options
    const [asyncOptions, setAsyncOptions] = useState<Option[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(false);

    useEffect(() => {
      if (typeof options === 'function') {
        const loadOptions = async () => {
          try {
            setLoadingOptions(true);
            const result = await options();
            setAsyncOptions(result);
          } catch (error) {
            console.error('Error loading options:', error);
          } finally {
            setLoadingOptions(false);
          }
        };
        loadOptions();
      }
    }, [options]);

    const fieldOptions = typeof options === 'function' ? asyncOptions : options;

    // Common props for form controls
    const commonProps = {
      name,
      control,
      defaultValue: field.defaultValue,
      rules: { required: required ? `${label || name} is required` : false },
    };

    // Common text field props
    const commonTextFieldProps = {
      fullWidth,
      label: label,
      placeholder: placeholder,
      disabled: disabled || loading,
      error: !!error,
      helperText: error ? error.message : helperText,
      ...textFieldProps,
      InputProps: {
        ...(startAdornment && {
          startAdornment: (
            <InputAdornment position="start">
              {startAdornment}
            </InputAdornment>
          ),
        }),
        ...(endAdornment && {
          endAdornment: (
            <InputAdornment position="end">
              {endAdornment}
            </InputAdornment>
          ),
        }),
        ...textFieldProps.InputProps,
      },
    };

    // Render the appropriate field based on type
    switch (type) {
      case 'hidden':
        return (
          <Controller
            {...commonProps}
            render={({ field: { value, onChange, ...field } }) => (
              <input type="hidden" value={value || ''} {...field} />
            )}
          />
        );

      case 'text':
      case 'email':
      case 'number':
      case 'textarea':
        return (
          <Controller
            {...commonProps}
            render={({ field: { ref, ...field } }) => (
              <TextField
                {...field}
                type={type === 'textarea' ? 'text' : type}
                multiline={type === 'textarea' || multiline}
                rows={rows || (type === 'textarea' ? 3 : undefined)}
                inputRef={ref}
                {...commonTextFieldProps}
              />
            )}
          />
        );

      case 'password':
        const [showPassword, setShowPassword] = React.useState(false);
        return (
          <Controller
            {...commonProps}
            render={({ field: { ref, ...field } }) => (
              <TextField
                {...field}
                type={showPassword ? 'text' : 'password'}
                inputRef={ref}
                {...commonTextFieldProps}
                InputProps={{
                  ...commonTextFieldProps.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={disabled || loading}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        );

      case 'select':
        return (
          <FormControl
            fullWidth
            error={!!error}
            disabled={disabled || loading}
            variant="outlined"
            {...selectProps.FormControlProps}
          >
            {label && <InputLabel id={`${name}-label`}>{label}</InputLabel>}
            <Controller
              {...commonProps}
              render={({ field: { ref, ...field } }) => (
                <Select
                  {...field}
                  labelId={`${name}-label`}
                  label={label}
                  inputRef={ref}
                  multiple={multiple}
                  renderValue={selectProps.renderValue}
                  {...selectProps}
                >
                  {loadingOptions ? (
                    <Box display="flex" justifyContent="center" p={2}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    fieldOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </MenuItem>
                    ))
                  )}
                </Select>
              )}
            />
            {error && <FormHelperText>{error.message}</FormHelperText>}
            {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      case 'autocomplete':
        return (
          <Controller
            {...commonProps}
            render={({ field: { onChange, value, ...field } }) => (
              <Autocomplete
                {...field}
                multiple={multiple}
                options={fieldOptions}
                value={value || (multiple ? [] : null)}
                onChange={(_, newValue) => {
                  onChange(newValue);
                }}
                isOptionEqualToValue={(option, value) => {
                  if (option && value) {
                    return option.value === (typeof value === 'object' ? value.value : value);
                  }
                  return false;
                }}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') {
                    const opt = fieldOptions.find((o) => o.value === option);
                    return opt ? opt.label : '';
                  }
                  return option?.label || '';
                }}
                loading={loadingOptions}
                disabled={disabled || loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    error={!!error}
                    helperText={error ? error.message : helperText}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loadingOptions ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={
                        typeof option === 'string'
                          ? fieldOptions.find((o) => o.value === option)?.label || option
                          : option.label
                      }
                      {...getTagProps({ index })}
                      key={index}
                    />
                  ))
                }
                {...autocompleteProps}
              />
            )}
          />
        );

      case 'checkbox':
        return (
          <FormControl component="fieldset" error={!!error}>
            <FormLabel component="legend">{label}</FormLabel>
            <Controller
              {...commonProps}
              render={({ field: { value, onChange, ...field } }) => (
                <Checkbox
                  {...field}
                  checked={!!value}
                  onChange={(e) => onChange(e.target.checked)}
                  disabled={disabled || loading}
                  {...checkboxProps}
                />
              )}
            />
            {error && <FormHelperText>{error.message}</FormHelperText>}
            {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl component="fieldset" error={!!error}>
            <FormLabel component="legend">{label}</FormLabel>
            <Controller
              {...commonProps}
              render={({ field: { value, onChange, ...field } }) => (
                <RadioGroup
                  value={value || ''}
                  onChange={(e) => onChange(e.target.value)}
                  {...field}
                  {...radioProps}
                >
                  {fieldOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio disabled={disabled || loading} />}
                      label={option.label}
                      disabled={option.disabled}
                    />
                  ))}
                </RadioGroup>
              )}
            />
            {error && <FormHelperText>{error.message}</FormHelperText>}
            {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      case 'switch':
        return (
          <FormControl component="fieldset" error={!!error}>
            <FormLabel component="legend">{label}</FormLabel>
            <Controller
              {...commonProps}
              render={({ field: { value, onChange, ...field } }) => (
                <Switch
                  {...field}
                  checked={!!value}
                  onChange={(e) => onChange(e.target.checked)}
                  disabled={disabled || loading}
                  {...checkboxProps}
                />
              )}
            />
            {error && <FormHelperText>{error.message}</FormHelperText>}
            {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              {...commonProps}
              render={({ field: { value, onChange, ...field } }) => (
                <DatePicker
                  {...field}
                  label={label}
                  value={value ? parseISO(new Date(value).toISOString()) : null}
                  onChange={(date) => {
                    onChange(date ? format(date, "yyyy-MM-dd") : null);
                  }}
                  disabled={disabled || loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!error}
                      helperText={error ? error.message : helperText}
                      {...textFieldProps}
                    />
                  )}
                  {...datePickerProps}
                />
              )}
            />
          </LocalizationProvider>
        );

      case 'time':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              {...commonProps}
              render={({ field: { value, onChange, ...field } }) => (
                <TimePicker
                  {...field}
                  label={label}
                  value={value || null}
                  onChange={(time) => {
                    onChange(time);
                  }}
                  disabled={disabled || loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!error}
                      helperText={error ? error.message : helperText}
                      {...textFieldProps}
                    />
                  )}
                  {...timePickerProps}
                />
              )}
            />
          </LocalizationProvider>
        );

      case 'datetime':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              {...commonProps}
              render={({ field: { value, onChange, ...field } }) => (
                <DateTimePicker
                  {...field}
                  label={label}
                  value={value || null}
                  onChange={(dateTime) => {
                    onChange(dateTime);
                  }}
                  disabled={disabled || loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!error}
                      helperText={error ? error.message : helperText}
                      {...textFieldProps}
                    />
                  )}
                  {...dateTimePickerProps}
                />
              )}
            />
          </LocalizationProvider>
        );

      case 'file':
        return (
          <Controller
            {...commonProps}
            render={({ field: { onChange, ...field }, fieldState }) => (
              <FileUpload
                field={field}
                fieldState={fieldState}
                formState={methods.formState}
                onChange={(files) => {
                  onChange(multiple ? files : files?.[0] || null);
                }}
                multiple={multiple}
                accept={textFieldProps.accept}
                buttonText={placeholder || 'Choose File'}
                helperText={helperText}
                disabled={disabled || loading}
              />
            )}
          />
        );

      case 'rating':
        return (
          <FormControl component="fieldset" error={!!error} fullWidth>
            <FormLabel component="legend">{label}</FormLabel>
            <Controller
              {...commonProps}
              render={({ field: { value, onChange, ...field } }) => (
                <Rating
                  {...field}
                  value={Number(value) || 0}
                  onChange={(_, newValue) => {
                    onChange(newValue);
                  }}
                  disabled={disabled || loading}
                  {...ratingProps}
                />
              )}
            />
            {error && <FormHelperText>{error.message}</FormHelperText>}
            {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      case 'slider':
        return (
          <FormControl component="fieldset" error={!!error} fullWidth>
            <FormLabel component="legend">{label}</FormLabel>
            <Controller
              {...commonProps}
              render={({ field: { value, onChange, ...field } }) => (
                <Slider
                  {...field}
                  value={value || 0}
                  onChange={(_, newValue) => {
                    onChange(newValue);
                  }}
                  valueLabelDisplay="auto"
                  disabled={disabled || loading}
                  {...sliderProps}
                />
              )}
            />
            {error && <FormHelperText>{error.message}</FormHelperText>}
            {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      default:
        return render ? (
          render({
            field: { name, value: fieldValue, onChange: (val: any) => setValue(name, val) },
            fieldState: { error: errors[name] },
            formState: methods.formState,
            methods,
          })
        ) : (
          <Controller
            {...commonProps}
            render={({ field: { ref, ...field } }) => (
              <TextField
                {...field}
                type="text"
                inputRef={ref}
                {...commonTextFieldProps}
              />
            )}
          />
        );
    }
  };

  // Default form actions
  const defaultActions: FormAction[] = [
    {
      label: resetButtonText,
      type: 'button',
      variant: 'outlined',
      color: 'secondary',
      onClick: () => reset(),
      disabled: loading,
      ...resetButtonProps,
    },
    {
      label: submitButtonText,
      type: 'submit',
      variant: 'contained',
      color: 'primary',
      startIcon: loading ? <CircularProgress size={20} color="inherit" /> : null,
      disabled: loading,
      ...submitButtonProps,
    },
  ];

  const formActions = actions.length > 0 ? actions : defaultActions;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          ...(typeof sx === 'function' ? sx(theme) : sx),
        }}
        {...paperProps}
      >
        {title && (
          <Box mb={2}>
            <Typography variant="h5" component="h2" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {showDivider && <Divider sx={{ mt: 2, mb: 3 }} />}
          </Box>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={gridSpacing}>
            {fields.map((field) => {
              if (field.hidden) {
                return (
                  <Grid item xs={12} key={field.name} sx={{ display: 'none' }}>
                    {renderField(field)}
                  </Grid>
                );
              }

              const gridProps = {
                xs: 12,
                ...(field.gridProps || {}),
              };

              return (
                <Grid item {...gridProps} key={field.name}>
                  {renderField(field)}
                </Grid>
              );
            })}

            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 2,
                  mt: 2,
                }}
              >
                {formActions.map((action, index) => (
                  <Button
                    key={index}
                    type={action.type || 'button'}
                    variant={action.variant || 'contained'}
                    color={action.color || 'primary'}
                    startIcon={action.startIcon}
                    endIcon={action.endIcon}
                    disabled={action.disabled || loading}
                    onClick={
                      action.onClick
                        ? () => action.onClick?.(methods)
                        : undefined
                    }
                    sx={action.sx}
                  >
                    {action.label}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
        </form>

        {debug && (
          <Box mt={4} p={2} bgcolor="background.paper" borderRadius={1}>
            <Typography variant="h6" gutterBottom>
              Form Debug
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={4}>
              <Box flex={1} minWidth={300}>
                <Typography variant="subtitle2" gutterBottom>
                  Values
                </Typography>
                <pre style={{ fontSize: '0.75rem', margin: 0 }}>
                  {JSON.stringify(watch(), null, 2)}
                </pre>
              </Box>
              <Box flex={1} minWidth={300}>
                <Typography variant="subtitle2" gutterBottom>
                  Errors
                </Typography>
                <pre style={{ fontSize: '0.75rem', margin: 0 }}>
                  {JSON.stringify(errors, null, 2)}
                </pre>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </LocalizationProvider>
  );
};

export default FormBuilder;
