import Avatar from "../components/Avatar";
import ConnectionInfo from "../components/ConnectionInfo";
import Layout from "../components/Layout";
import NetworkStats from "../components/NetworkStats";

export default () => {
  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between">
          <h1 className="text-2xl font-semibold  text-gray-900 dark:text-white">
            Network Status
          </h1>
          <Avatar />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-6">
          {/* Replace with your content */}
          <NetworkStats />
          <ConnectionInfo />
          {/* /End replace */}
        </div>
      </div>
    </Layout>
  );
};
