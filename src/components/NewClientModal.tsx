import React, { useState } from "react";
import {
  Home,
  Briefcase,
  Palette,
  Building2,
  User,
  HomeIcon,
} from "lucide-react";

export type ClientType =
  | "Homeowner"
  | "Contractor"
  | "Realtor"
  | "Designer"
  | "Property Manager"
  | "Other";

const clientTypeOptions = [
  { value: "Homeowner", label: "Homeowner", icon: Home },
  { value: "Contractor", label: "Contractor", icon: Briefcase },
  { value: "Realtor", label: "Realtor", icon: HomeIcon },
  { value: "Designer", label: "Designer", icon: Palette },
  { value: "Property Manager", label: "Property Mgr", icon: Building2 },
  { value: "Other", label: "Other", icon: User },
];

const TextInput = ({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div style={{ marginBottom: "16px" }}>
    <div
      style={{
        fontSize: "13px",
        fontWeight: 600,
        marginBottom: "6px",
        color: "#E0E0E0",
      }}
    >
      {label}
    </div>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: "8px",
        backgroundColor: "#1A1A1A",
        border: "1px solid #444",
        color: "#FFF",
        fontSize: "13px",
      }}
    />
  </div>
);

export const NewClientModal = () => {
  const [clientType, setClientType] = useState<ClientType>("Homeowner");
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const showCompanyName =
    clientType !== "Homeowner";

  return (
    <div style={{ padding: "24px" }}>
      {/* CLIENT TYPE */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        {clientTypeOptions.map(({ value, label, icon: Icon }) => {
          const active = clientType === value;
          return (
            <button
              key={value}
              onClick={() => {
                setClientType(value);
                if (value === "Homeowner") setCompanyName("");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "10px",
                border: active ? "2px solid #7BAA8E" : "1px solid #444",
                background: active ? "#7BAA8E" : "transparent",
                color: active ? "#FFF" : "#AAA",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>

      {/* COMPANY NAME */}
      {showCompanyName && (
        <TextInput
          label="Company Name"
          placeholder="Enter company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      )}

      {/* CONTACT */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <TextInput
          label="First Name"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextInput
          label="Last Name"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
    </div>
  );
};
