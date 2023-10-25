import { RouterProvider } from "react-router-dom";
import { AdminRouter } from "@app/routes/admin";
import React, { Suspense } from "react";
import { SnackbarProvider } from 'notistack'
// import * as AuthService from "@app/services/auth.service";
// import { useDispatch, useSelector } from "react-redux";
import Provider from "@app/theme/provider";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import Preloader from "@app/components/Preloader";
// import { PreloaderActions } from "./store/slices/preloader";

const ObjectDialog = React.lazy(() => import("@app/components/ObjectDialog"));


export default function App() {
    //const auth = useSelector(state => state.auth);
    // const dispatch = useDispatch();
    // const verifyToken = useCallback(async () => {
    //     dispatch(PreloaderActions.show());
    //     AuthService.verify().then(() => {
    //         AuthService.me();
    //     }).catch(() => {
    //     }).finally(() => {
    //         dispatch(PreloaderActions.hide());
    //     })
    // }, [dispatch]);

    // useEffect(() => {
    //     verifyToken();
    // }, [verifyToken])

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Provider>
                <React.Fragment>
                    {/* {
                        auth.accessToken ? ( */}
                    <RouterProvider router={AdminRouter} />
                    {/* //     ) : (
                    //         <Suspense fallback={<LoadingWrapper />}>
                    //             <LoginPage />
                    //         </Suspense>

                    //     )
                    // } */}
                </React.Fragment>
                <SnackbarProvider anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }} />

                <Suspense>
                    <ObjectDialog />
                </Suspense>
                <Preloader />
            </Provider>
        </LocalizationProvider >
    )

}