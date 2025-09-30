import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { User } from "../types";
import { motion } from "framer-motion";

export const ProfilePage: React.FC = () => {
  const { user: storeUser, logout, token, isAuthenticated } = useAuthStore();
  const [user, setUser] = useState<User | null>(storeUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Since we're using local storage now, just use the user from the store
    if (storeUser) {
      setUser(storeUser);
    } else if (!isAuthenticated) {
      setError("User not authenticated");
    }
  }, [storeUser, isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          {isLoading ? (
            <div className="p-8 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="p-8">
              <div className="bg-red-50 text-red-800 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : user ? (
            <>
              <div className="bg-primary-700 px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-white">
                    User Profile
                  </h3>
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="flex items-center space-x-5 mb-8">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-r from-primary-400 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.name}
                    </h1>
                    <p className="text-sm font-medium text-gray-500">
                      Member since{" "}
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>

                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        User
                      </span>
                    </dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">About</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      No additional information provided.
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-gray-50 px-4 py-5 sm:px-6">
                <button
                  onClick={handleLogout}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No user information available
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
