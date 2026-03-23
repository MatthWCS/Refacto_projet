import { ToastContainer } from "react-toastify"

export const Toaster = () => {

    const toasterConfig = {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        newestOnTop: true
    }

    return (
        <ToastContainer {...toasterConfig} />
    )
}