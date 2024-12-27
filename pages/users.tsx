import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../client";

interface User {
  user_id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

const ConsentUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const router = useRouter();

  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("User") 
        .select("*, user_id");
      console.log("🚀 ~ fetchUsers ~ data:", data)
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const toggleDropdown = (): void => setDropdownOpen((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Full-Width Navbar */}
      <header className="w-full flex items-center justify-between px-4 py-4 bg-gray-800 text-white">
        <div className="flex items-center">
          <span className="text-white font-bold text-lg">CONSENT POLICY</span>
        </div>
        <div className="relative">
          <div className="flex items-center space-x-3">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400"
              onClick={toggleDropdown}
            >
              <img
                src="https://www.svgrepo.com/show/495590/profile-circle.svg"
                alt="Profile"
                width={40}
                height={40}
                style={{ borderRadius: 20 }}
              />
            </button>
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2">
              <button
                className="block w-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 transition"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`bg-gray-800 w-64 h-screen p-4 md:block ${sidebarOpen ? 'block' : 'hidden'} md:flex transition-all duration-300`}
        >
          <nav>
            <ul className="space-y-2">
              <li>
                <a href="/profile" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                  Policy
                </a>
              </li>
              <li>
                <a href="/agreement" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                  Agreements
                </a>
              </li>
              <li>
                <a href="/users" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                  Users
                </a>
              </li>
              <li>
                <a href="/consent-records" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                  Consent Records
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden p-4 bg-gray-800 text-white"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          ☰
        </button>

        {/* Main Content */}
        <main className="flex-grow p-6 bg-gray-100">
          <h1 className="text-2xl font-bold mb-4">Users</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="border border-gray-300 px-4 py-2 text-center font-bold">User ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-bold">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-bold">Email</th>
                    <th className="border border-gray-300 px-4 py-2 text-center font-bold">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.user_id} className="hover:bg-gray-50 text-center">
                      <td className="border border-gray-300 px-4 py-2">{user.user_id}</td>
                      <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ConsentUsers;
