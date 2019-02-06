import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0052CC',
      dark: '#172B4D',

      //light: '#5d7eff',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#FF5630',
      yellow: '#FFAB00',
      green: '#36B37E',
      purple: '#6554C0',
      contrastText: '#ffffff'
    }
  },
  typography: {
    useNextVariants: true
  }
});
