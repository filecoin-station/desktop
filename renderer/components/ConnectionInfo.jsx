const ConnectionInfo = () => {
  return (
    <div className="bg-white dark:bg-slate-900 shadow dark:border-2 dark:border-slate-800 overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-slate-300">
          Connected to IPFS
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-slate-400">
          Hosting 2 MiB of data — Discovered 101 peers
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-slate-800">
        <dl>
          <div className="bg-gray-50 dark:bg-slate-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Peer ID</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-slate-400">
              12D3KooWBtpbPPZGh3QFmGW881QcmYdbnc8cog57YYCMJPRcaGgN
            </dd>
          </div>
          <div className="bg-white dark:bg-slate-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Agent</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-slate-400">
              go-ipfsv0.11.0 desktop
            </dd>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">UI</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-slate-400">
              v2.15.0
            </dd>
          </div>
          <div className="bg-white dark:bg-slate-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Gateway</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 dark:text-slate-400">
              http://127.0.0.1:8080
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ConnectionInfo;
