const Avatar = () => {
  return (
    <a href="#" className="flex-shrink-0 group block">
      <div className="flex items-center">
        <div className="mr-3 text-right">
          <p className="text-sm font-medium text-gray-700 dark:text-slate-400 dark:group-hover:text-slate-300 group-hover:text-gray-900">
            00sasd...a123
          </p>
          <p className="text-xs font-medium text-gray-500 dark:text-slate-500 dark:group-hover:text-slate-400 group-hover:text-gray-700">
            5.6K coins
          </p>
        </div>
        <div>
          <img
            className="inline-block h-9 w-9 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
        </div>
      </div>
    </a>
  );
};

export default Avatar;
