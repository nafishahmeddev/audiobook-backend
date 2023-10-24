// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://haaki.app" target="_blank" underline="hover">
      audiobook.app
    </Typography>
    <Typography variant="subtitle2" component={Link} href="https://haaki.com" target="_blank" underline="hover">
      &copy; audiobook.com
    </Typography>
  </Stack>
);

export default AuthFooter;
