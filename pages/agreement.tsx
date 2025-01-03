import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../client";
import { v4 as uuidv4 } from "uuid";

interface DataAttribute {
  id: number;
  name: string;
  description: string;
}

interface Agreement {
  agreement_id: string;
  agreement_name: string;
  policy_id: string;
  purpose: string;
  purpose_description: string;
  is_active: boolean;
  data_attributes: DataAttribute[];
  version: string;
}

interface Policy {
  policy_id: string;
  policy_name: string;
}

const AgreementComponent: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddAgreementForm, setShowAddAgreementForm] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [newAgreement, setNewAgreement] = useState<Agreement>({
    agreement_id: "",
    agreement_name: "",
    policy_id: "",
    purpose: "",
    purpose_description: "",
    is_active: true,
    data_attributes: [],
    version: "1.0", 
  });
  const [editAgreement, setEditAgreement] = useState<Agreement | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);  // State for policies

  const router = useRouter();

  // Fetch agreements and policies from Supabase
  useEffect(() => {
    // const fetchAgreementsAndPolicies = async (policy_id: string) => {
    //   try {
    //     // Fetching agreements
    //     const { data: agreementData, error: agreementError } = await supabase.from("Agreement").select("agreement_id, Policy:policy_id(*)").eq("policy_id", policy_id);
    //     console.log("🚀 ~ fetchAgreementsAndPolicies ~ data:", agreementData)
    //     if (agreementError) {
    //       console.error("Error fetching agreements:", agreementError.message);
    //     } else {
    //       setAgreements(agreementData as Agreement[]);
    //     }

    //     // Fetching policies for dropdown
    //     const { data: policyData, error: policyError } = await supabase.from("Policy").select("*");
    //     if (policyError) {
    //       console.error("Error fetching policies:", policyError.message);
    //     } else {
    //       setPolicies(policyData as Policy[]);
    //     }
    //   } catch (error) {
    //     console.error("Unexpected error:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const fetchAgreementsAndPolicies = async () => {
      try {
        // Fetching agreements
        const { data: agreementData, error: agreementError } = await supabase.from("Agreement").select('*');
        console.log("🚀 ~ fetchAgreementsAndPolicies ~ data:", agreementData)
        if (agreementError) {
          console.error("Error fetching agreements:", agreementError.message);
        } else {
          setAgreements(agreementData as Agreement[]);
        }

        // Fetching policies for dropdown
        const { data: policyData, error: policyError } = await supabase.from("Policy").select("*");
        if (policyError) {
          console.error("Error fetching policies:", policyError.message);
        } else {
          setPolicies(policyData as Policy[]);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgreementsAndPolicies();
  }, []);

  const toggleDropdown = (): void => setDropdownOpen((prev) => !prev);

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();  // This will sign the user out
    router.push("/");  // Redirect to home page after logout
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    if (editAgreement) {
      setEditAgreement({ ...editAgreement, [e.target.name]: e.target.value });
    } else {
      setNewAgreement({ ...newAgreement, [e.target.name]: e.target.value });
    }
  };

  const handleDataAttributeChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const newAttributes = [...(editAgreement ? editAgreement.data_attributes : newAgreement.data_attributes)];
    newAttributes[index][e.target.name] = e.target.value;
    if (editAgreement) {
      setEditAgreement({ ...editAgreement, data_attributes: newAttributes });
    } else {
      setNewAgreement({ ...newAgreement, data_attributes: newAttributes });
    }
  };

  const handleAddDataAttribute = (): void => {
    const newAttribute: DataAttribute = { id: Date.now(), name: "", description: "" };
    if (editAgreement) {
      setEditAgreement({
        ...editAgreement,
        data_attributes: [...editAgreement.data_attributes, newAttribute],
      });
    } else {
      setNewAgreement({
        ...newAgreement,
        data_attributes: [...newAgreement.data_attributes, newAttribute],
      });
    }
  };

  const handleRemoveDataAttribute = (index: number): void => {
    const newAttributes = [...(editAgreement ? editAgreement.data_attributes : newAgreement.data_attributes)];
    newAttributes.splice(index, 1);
    if (editAgreement) {
      setEditAgreement({ ...editAgreement, data_attributes: newAttributes });
    } else {
      setNewAgreement({ ...newAgreement, data_attributes: newAttributes });
    }
  };

  const handleAddAgreement = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("Agreement")
        .upsert([{ ...newAgreement, agreement_id: uuidv4() }]);

      if (error) {
        console.error("Error adding agreement:", error.message);
      } else {
        setAgreements((prevAgreements) => [...prevAgreements, data[0] as Agreement]);
        setShowAddAgreementForm(false);
        setNewAgreement({
          agreement_id: "",
          agreement_name: "",
          policy_id: "",
          purpose: "",
          purpose_description: "",
          is_active: true,
          data_attributes: [],
          version: "1.0", 
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleEditAgreement = (agreement: Agreement): void => {
    setEditAgreement(agreement);
    setShowAddAgreementForm(true);
  };

  const handleUpdateAgreement = async (): Promise<void> => {
    try {
      if (!editAgreement) return;

      const newVersion = (parseFloat(editAgreement.version) + 0.1).toFixed(1);

      const updatedAgreement = {
        ...editAgreement,
        agreement_id: uuidv4(),
        version: newVersion,
      };

      const { data, error } = await supabase.from("Agreement").upsert(updatedAgreement);

      if (error) {
        console.error("Error updating agreement:", error.message);
      } else {
        setAgreements((prevAgreements) => [...prevAgreements, updatedAgreement]);
        setShowAddAgreementForm(false);
        setEditAgreement(null);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full flex items-center justify-between px-4 py-4 bg-gray-800 text-white">
        <div className="flex items-center">
          <span className="text-white font-bold text-lg">CONSENT POLICY</span>
        </div>

        <div className="relative">
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

        <main className="flex-grow p-6 bg-gray-100">
          <h1 className="text-2xl font-bold mb-4">Agreement List</h1>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <>
              <button
                onClick={() => setShowAddAgreementForm(true)}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Add Agreement
              </button>

              {showAddAgreementForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-bold mb-4">
                      {editAgreement ? "Edit Agreement" : "Add New Agreement"}
                    </h3>
                    <form
                      onSubmit={editAgreement ? handleUpdateAgreement : handleAddAgreement}
                    >
                      <div className="mb-4">
                        <label className="block text-gray-700">Agreement Name</label>
                        <input
                          type="text"
                          name="agreement_name"
                          value={editAgreement ? editAgreement.agreement_name : newAgreement.agreement_name}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Policy</label>
                        <select
                          name="policy_id"
                          value={editAgreement ? editAgreement.policy_id : newAgreement.policy_id}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        >
                          <option value="">Select Policy</option>
                          {policies.map((policy) => (
                            <option key={policy.policy_id} value={policy.policy_id}>
                              {policy.policy_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Purpose</label>
                        <input
                          type="text"
                          name="purpose"
                          value={editAgreement ? editAgreement.purpose : newAgreement.purpose}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Purpose Description</label>
                        <textarea
                          name="purpose_description"
                          value={editAgreement ? editAgreement.purpose_description : newAgreement.purpose_description}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700">Data Attributes</label>
                        {(
                          editAgreement ? editAgreement.data_attributes : newAgreement.data_attributes
                        ).map((attribute, index) => (
                          <div key={index} className="flex space-x-4 mb-2">
                            <input
                              type="text"
                              name="name"
                              placeholder="Attribute Name"
                              value={attribute.name}
                              onChange={(e) => handleDataAttributeChange(index, e)}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              required
                            />
                            <input
                              type="text"
                              name="description"
                              placeholder="Attribute Description"
                              value={attribute.description}
                              onChange={(e) => handleDataAttributeChange(index, e)}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveDataAttribute(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddDataAttribute}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Add Data Attribute
                        </button>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-500 text-white rounded-lg"
                        >
                          {editAgreement ? "Update Agreement" : "Add Agreement"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddAgreementForm(false);
                            setEditAgreement(null);
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
              

              <div className="space-y-4">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="border border-gray-300 px-4 py-2">Agreement Name</th>
                      <th className="border border-gray-300 px-4 py-2">Policy</th>
                      <th className="border border-gray-300 px-4 py-2">Purpose</th>
                      <th className="border border-gray-300 px-4 py-2">Version</th>
                      <th className="border border-gray-300 px-4 py-2">Active</th>
                      <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agreements.map((agreement) => {
                      const policy = policies.find(p => p.policy_id === agreement.policy_id);
                      return (
                        <tr key={agreement.agreement_id} className="bg-white hover:bg-gray-100">
                          <td className="px-4 py-2 border-b border border-gray-300">{agreement.agreement_name}</td>
                          <td className="px-4 py-2 border-b border border-gray-300">{policy ? policy.policy_name : 'Unknown'}</td>
                          <td className="px-4 py-2 border-b border border-gray-300">{agreement.purpose}</td>
                          <td className="px-4 py-2 border-b border border-gray-300">{agreement.version}</td>
                          <td className="px-4 py-2 border-b border border-gray-300">{agreement.is_active ? "Yes" : "No"}</td>
                          <td className="px-4 py-2 border-b text-center">
                            <button
                              onClick={() => handleEditAgreement(agreement)}
                              className="px-2 py-1 bg-yellow-500 text-white rounded-lg"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AgreementComponent;
