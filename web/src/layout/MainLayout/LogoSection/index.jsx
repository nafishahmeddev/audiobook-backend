import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { ButtonBase } from '@mui/material';

// project imports
import config from '@app/config';
import { MENU_OPEN } from '@app/store/actions';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {

  const defaultId = useSelector((state) => state.auth.name);
  const dispatch = useDispatch();
  return (
    <ButtonBase disableRipple onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })} component={Link} to={config.defaultPath}>
      <h2 style={{ color: "skyblue", marginLeft: "10%" }}>Audio Book</h2>
    </ButtonBase>
  );
};

export default LogoSection;
