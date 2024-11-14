export interface SnackbarData {
  action: string;
  message: string;
  panelClass: string[];
  duration?: number;
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';
  verticalPosition?: 'top' | 'bottom';
}
