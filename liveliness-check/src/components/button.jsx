import PropTypes from "prop-types";
import WhiteSpinner from "./white-spinner";

export const Button = ({
  children,
  loading,
  theme = "primary",
  variant = "solid",
  size = "normal",
  className = "",
  ...rest
}) => {
  function themeStyle() {
    const outlinedClasses =
      "text-primary outline outline-2 outline-primary hover:bg-secondary/10";
    const dangerClasses =
      "text-red-500 outline outline-2 outline-red-500 hover:bg-red-500/10";
    const solidClasses =
      "text-white bg-primary outline outline-2 outline-primary dark:outline-darkPrimary";
    return variant === "solid"
      ? solidClasses
      : variant === "danger"
      ? dangerClasses
      : outlinedClasses;
  }

  function handleSize(size) {
    if (size === "small") {
      return "p-2 text-sm";
    }
    return "p-3";
  }

  return (
    <button
      className={`w-full ${handleSize(
        size
      )} font-bold rounded-md hover:opacity-80 flex items-center justify-center gap-1 text-sm disabled:bg-gray-400 disabled:outline-gray-600 disabled:outline-2 ${themeStyle(
        theme
      )} ${className}`}
      {...rest}
    >
      {loading ? <WhiteSpinner /> : children}
    </button>
  );
};

Button.propTypes = {
  loading: PropTypes.bool,
  variant: PropTypes.string,
  children: PropTypes.any,
  theme: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
};
