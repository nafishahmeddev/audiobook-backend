import {
    createBrowserRouter,
} from "react-router-dom";
import ErrorPage from "@app/pages/ErrorPage";
import AdminLayout from "@app/components/layouts/AdminLayout";
import AlbumsPage from "@app/pages/admin/albums/AlbumsPage";
import AlbumFormPage from "@app/pages/admin/albums/AlbumFormPage";

export const AdminRouter = createBrowserRouter([
    {
        path: "",
        element: <AdminLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "",
                element: <></>,
            },
            {
                path: "albums",
                element: <AlbumsPage />
            },
            {
                path: "albums/form/:_id",
                element: <AlbumFormPage />
            }
        ]
    },
]);

export default function Rash() {
    return (<></>);
}