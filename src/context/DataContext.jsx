import React, { createContext, useContext, useState, useEffect } from "react";
import { useMsal, useAccount } from "@azure/msal-react";

// CHANGE to the real admin email
const INITIAL_ADMIN_EMAIL = "mesfin.yerga@arcadis.com";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

// -- Local Storage Helpers for User Persistence --
const USERS_KEY = "pgls_ai_users";

// Enforce the super admin rule for a single user object
function normalizeUser(user) {
  if (!user) return null;
  if (user.email === INITIAL_ADMIN_EMAIL) {
    return {
      ...user,
      isAdmin: true,
      isApproved: true
    };
  }
  return user;
}

// Enforce the super admin rule for the users array
function normalizeUsers(users) {
  return users.map(u => normalizeUser(u));
}

function loadUsers() {
  try {
    const fromStorage = JSON.parse(localStorage.getItem(USERS_KEY));
    if (Array.isArray(fromStorage)) return normalizeUsers(fromStorage);
  } catch {}
  // default: admin only
  return [
    { email: INITIAL_ADMIN_EMAIL, name: "Arcadis Admin", isAdmin: true, isApproved: true }
  ];
}
function saveUsers(users) {
  // Always normalize before saving
  localStorage.setItem(USERS_KEY, JSON.stringify(normalizeUsers(users)));
}

function DataProvider({ children }) {
  // MSAL auth
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [user, setUser] = useState(null);

  // --- User/admin management ---
  const [users, setUsers] = useState(loadUsers);

  // When users changes, persist (normalize first)
  useEffect(() => {
    saveUsers(users);
  }, [users]);

  // On login: add new user if missing, update user info
  useEffect(() => {
    if (account) {
      // If not present, add new user (never allow overwriting admin status if super admin)
      const existing = users.find(u => u.email === account.username);
      if (!existing) {
        setUsers(prev => normalizeUsers([
          ...prev,
          {
            email: account.username,
            name: account.name,
            isAdmin: false,
            isApproved: false
          }
        ]));
      }
    }
    // Set current user session (normalize always)
    if (account) {
      const found = users.find(u => u.email === account.username);
      setUser(normalizeUser({
        name: account.name,
        email: account.username,
        avatar: account.idTokenClaims?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}`,
        isAdmin: found?.isAdmin || false,
        isApproved: found?.isApproved || false
      }));
    } else {
      setUser(null);
    }
    // eslint-disable-next-line
  }, [account, users]);

  // Admin controls
  const approveUser = email => setUsers(users =>
    normalizeUsers(
      users.map(u => u.email === email ? { ...u, isApproved: true } : u)
    )
  );
  const makeAdmin = email => setUsers(users =>
    normalizeUsers(
      users.map(u => u.email === email ? { ...u, isAdmin: true, isApproved: true } : u)
    )
  );
  // Remove user, but NEVER remove the super admin
  const removeUser = email => {
    if (email === INITIAL_ADMIN_EMAIL) return;
    setUsers(users => normalizeUsers(users.filter(u => u.email !== email)));
  };

  // --- File/Data states ---
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const clearData = () => {
    setFile(null);
    setColumns([]);
    setData([]);
  };

  // --- AI/NLQ states ---
  // For Natural Language Q&A
  const [nlqAnswer, setNlqAnswer] = useState("");
  // For AI chart recommendations (ExportPanel, etc)
  const [chartRec, setChartRec] = useState("");

  // MSAL login/logout helpers
  const login = () => instance.loginRedirect();
  const logout = () => instance.logoutRedirect();

  return (
    <DataContext.Provider value={{
      // User/admin
      user: normalizeUser(user), // always normalized!
      setUser,
      users: normalizeUsers(users), // always normalized!
      setUsers: (u) => setUsers(normalizeUsers(u)),
      approveUser, makeAdmin, removeUser,
      login, logout,
      // Data/file
      file, setFile,
      columns, setColumns,
      data, setData,
      clearData,
      // AI/NLQ
      nlqAnswer, setNlqAnswer,
      chartRec, setChartRec
    }}>
      {children}
    </DataContext.Provider>
  );
}

export { DataContext, DataProvider };
