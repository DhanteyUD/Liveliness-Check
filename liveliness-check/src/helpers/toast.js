import { toast } from "react-toastify";

const customId = "toast-custom-id";

const toastHelper = (
	type,
	message,
	position = "top-center",
	timeOut = 2000,
	hideProgressBar = true
) => {
	if (type && toast[type]) {
		toast[type](message, {
			position,
			toastId: customId,
			autoClose: timeOut,
			hideProgressBar,
		});
	} else {
		toast(message, {
			position,
			toastId: customId,
			autoClose: timeOut,
			hideProgressBar,
		});
	}
};

export const showToastSuccess = (message, position, timeOut, hideProgressBar) =>
	toastHelper("success", message, position, timeOut, hideProgressBar);

export const showToastInfo = (message, position, timeOut, hideProgressBar) =>
	toastHelper("info", message, position, timeOut, hideProgressBar);

export const showToastWarning = (message, position, timeOut, hideProgressBar) =>
	toastHelper("warn", message, position, timeOut, hideProgressBar);

export const showToastError = (message, position, timeOut, hideProgressBar) =>
	toastHelper("error", message, position, timeOut, hideProgressBar);

export const showToast = (message, position, timeOut, hideProgressBar) =>
	toastHelper(null, message, position, timeOut, hideProgressBar);
