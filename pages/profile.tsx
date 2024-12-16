import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../client";
import { v4 as uuidv4 } from "uuid"; 

interface Policy {
  policy_id: string;
  policy_name: string;
  policy_description: string;
  version: string; 
  jurisdiction: string;
  industrySector: string;
  created_at: string;
  updated_at?: string; 
}

const ConsentPolicy: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddPolicyForm, setShowAddPolicyForm] = useState<boolean>(false);
  const [newPolicy, setNewPolicy] = useState<Policy>({
    policy_id: "",
    policy_name: "",
    policy_description: "",
    version: "1.0", 
    jurisdiction: "",
    industrySector: "",
    created_at: new Date().toISOString(),
  });
  const [editPolicy, setEditPolicy] = useState<Policy | null>(null);

  const router = useRouter();

  // Fetch policy data from Supabase
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const { data, error } = await supabase.from("Policy").select("*");
        if (error) {
          console.error("Error fetching data:", error.message);
        } else {
          setPolicies(data as Policy[]);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  const toggleDropdown = (): void => setDropdownOpen((prev) => !prev);

  const handleLogout = async (): Promise<void> => {
    router.push("/");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    if (editPolicy) {
      setEditPolicy({ ...editPolicy, [e.target.name]: e.target.value });
    } else {
      setNewPolicy({ ...newPolicy, [e.target.name]: e.target.value });
    }
  };

  const handleAddPolicy = async (): Promise<void> => {
    try {
      // Use UUID generator to set policy_id
      const { data, error } = await supabase
        .from("Policy")
        .upsert([{ ...newPolicy, policy_id: uuidv4() }], { onConflict: "policy_id" });

      if (error) {
        console.error("Error adding policy:", error.message);
      } else {
        setPolicies((prevPolicies) => [...prevPolicies, data[0] as Policy]);
        setShowAddPolicyForm(false);
        setNewPolicy({
          policy_id: "",
          policy_name: "",
          policy_description: "",
          version: "1.0",
          jurisdiction: "",
          industrySector: "",
          created_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleEditPolicy = (policy: Policy): void => {
    setEditPolicy(policy);
    setShowAddPolicyForm(true);
  };

  const handleUpdatePolicy = async (policyId: string): Promise<void> => {
    try {
      if (!editPolicy) return;
  
      // Generate a new version
      const newVersion = `${parseFloat(editPolicy.version) + 0.1}`;
  
      const updatedPolicy = {
        policy_id: uuidv4(), 
        policy_name: editPolicy.policy_name,
        policy_description: editPolicy.policy_description,
        jurisdiction: editPolicy.jurisdiction,
        industrySector: editPolicy.industrySector,
        version: newVersion, 
        created_at: editPolicy.created_at,
        updated_at: new Date().toISOString(), 
      };
  
      const { data, error } = await supabase
        .from("Policy")
        .upsert(updatedPolicy, { onConflict: "policy_id" });
  
      if (error) {
        if (error.code === "23505") { // Handle duplicate policy_id case
          console.error("Error updating policy: Duplicate policy_id");
        } else {
          console.error("Error updating policy:", error.message);
        }
      } else {
        setPolicies((prevPolicies) =>
          prevPolicies.map((p) =>
            p.policy_id === policyId ? updatedPolicy : p
          )
        );
        setShowAddPolicyForm(false); 
        setEditPolicy(null);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Full-Width Navbar */}
      <header className="w-full flex items-center justify-between px-4 py-4 bg-gray-800 text-white">
        <div className="flex items-center">
          {/* <img className="w-10 h-10 rounded-full mr-2" src="" alt="Logo" /> */}
          <span className="text-white font-bold text-lg">CONSENT POLICY</span>
        </div>

        <div className="relative">
          <div className="flex items-center space-x-3">
            {/* <p className="hidden sm:block">user@example.com</p> */}
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
        <aside className="bg-gray-800 w-64 h-screen p-4 hidden md:block">
          <nav>
            <ul className="space-y-2">
              <li>
                <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                  Policy
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                  Agreement
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-2 text-white hover:bg-gray-700 rounded">
                  User
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6 bg-gray-100">
          <h1 className="text-2xl font-bold mb-4">Policy List</h1>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <>
              <button
                onClick={() => setShowAddPolicyForm(true)}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Add Policy
              </button>

              {showAddPolicyForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                    <h3 className="text-xl font-bold mb-4">
                      {editPolicy ? "Edit Policy" : "Add New Policy"}
                    </h3>
                    <form
                      onSubmit={editPolicy ? () => handleUpdatePolicy(editPolicy.policy_id) : handleAddPolicy}
                    >
                      <div className="mb-4">
                        <label className="block text-gray-700">Policy Name</label>
                        <input
                          type="text"
                          name="policy_name"
                          value={editPolicy ? editPolicy.policy_name : newPolicy.policy_name}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <textarea
                          name="policy_description"
                          value={editPolicy ? editPolicy.policy_description : newPolicy.policy_description}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Version</label>
                        <input
                          type="text"
                          name="version"
                          value={editPolicy ? editPolicy.version : newPolicy.version}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          readOnly={!editPolicy}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Jurisdiction</label>
                        <input
                          type="text"
                          name="jurisdiction"
                          value={editPolicy ? editPolicy.jurisdiction : newPolicy.jurisdiction}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Industry Sector</label>
                        <input
                          type="text"
                          name="industrySector"
                          value={editPolicy ? editPolicy.industrySector : newPolicy.industrySector}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-500 text-white rounded-lg"
                        >
                          {editPolicy ? "Update Policy" : "Add Policy"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddPolicyForm(false);
                            setEditPolicy(null); // Clear the edit state
                          }}
                          className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {policies.map((policy) => (
                  <div
                    key={policy.policy_id}
                    className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
                  >
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      {policy.policy_name}
                    </h2>
                    <p className="text-gray-600 mb-1">
                      <strong>Description:</strong> {policy.policy_description}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Version:</strong> {policy.version}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Jurisdiction:</strong> {policy.jurisdiction}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Sector:</strong> {policy.industrySector}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Created at: {new Date(policy.created_at).toLocaleDateString()}
                    </p>
                    <button
                      className="mt-4 px-4 py-2 bg-yellow-400 text-white rounded-lg"
                      onClick={() => handleEditPolicy(policy)}
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ConsentPolicy;
