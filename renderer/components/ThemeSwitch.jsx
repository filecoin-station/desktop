import { Switch } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import { useTheme } from "next-themes";
import { classNames } from "../helpers";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Switch
      checked={theme === "light"}
      onChange={() => {
        setTheme(theme === "light" ? "dark" : "light");
      }}
      className={classNames(
        theme === "light" ? "bg-gray-200" : "bg-slate-700",
        "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={classNames(
          theme === "light" ? "translate-x-5 bg-white" : "translate-x-0 bg-slate-900",
          "pointer-events-none relative inline-block h-5 w-5 rounded-full  shadow transform ring-0 transition ease-in-out duration-200"
        )}
      >
        <span
          className={classNames(
            theme === "light"
              ? "opacity-0 ease-out duration-100"
              : "opacity-100 ease-in duration-200",
            "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
          )}
          aria-hidden="true"
        >
          <MoonIcon className="h-3 w-3 text-white" />
        </span>
        <span
          className={classNames(
            theme === "light"
              ? "opacity-100 ease-in duration-200"
              : "opacity-0 ease-out duration-100",
            "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
          )}
          aria-hidden="true"
        >
          <SunIcon className="h-3 w-3 text-slate-600" />
        </span>
      </span>
    </Switch>
  );
};

export default ThemeSwitch;
