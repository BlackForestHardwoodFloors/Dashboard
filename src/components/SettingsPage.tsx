/**
 * Settings Page - Boardroom 360
 */

import { useState, useEffect } from 'react';
import { Settings, Users, Building, Shield, Receipt, ChevronRight, User, Mail, Phone, Edit, Save, Plus, X } from 'lucide-react';
import { SidebarEnhanced } from './SidebarEnhanced';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  roleId?: string;
  department: string;
  departmentId?: string;
  status: 'active' | 'inactive';
  hourlyRate?: number;
  color?: string;
}

interface NewEmployeeForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  password: string;
  hourlyRate: string;
  color: string;
}

export default function SettingsPage({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('employees');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEmployee, setNewEmployee] = useState<NewEmployeeForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    password: '',
    hourlyRate: '',
    color: '#D4A024'
  });
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    status: string;
    hourlyRate: string;
    color: string;
  } | null>(null);

  const bgColor = darkMode ? '#1E1E1E' : '#F5F5F5';
  const cardBg = darkMode ? '#2D2D2D' : '#FFFFFF';
  const textColor = darkMode ? '#FFFFFF' : '#1E1E1E';
  const textMuted = darkMode ? '#A0A0A0' : '#666666';
  const borderColor = darkMode ? '#3D3D3D' : '#E5E5E5';
  const accentColor = '#D4A024';

  const tabs = [
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'departments', label: 'Departments', icon: Building },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'taxes', label: 'Taxes', icon: Receipt },
  ];

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  // Fetch employees from database on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://35.92.33.215:3001/employee/get-employees', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        console.log('Employee API response:', data);
        
        if (response.ok && data.data) {
          const formattedEmployees = data.data.map((emp: any) => {
            const roleId = emp['Roles & Permissions']?.id || emp.rolesPermissions || '';
            const deptId = emp.Department?.id || emp.department || '';
            const roleName = emp['Roles & Permissions']?.Role || roleOptions.find(r => r.id === Number(roleId))?.name || 'Unknown';
            const deptName = emp.Department?.['Department Name'] || departmentOptions.find(d => d.id === Number(deptId))?.name || 'Unknown';
            
            return {
              id: String(emp.id),
              name: `${emp['First Name'] || emp.firstName || ''} ${emp['Last Name'] || emp.lastName || ''}`.trim(),
              email: emp.Email || emp.email || '',
              phone: emp.Phone || emp.phone || '',
              role: roleName,
              roleId: String(roleId),
              department: deptName,
              departmentId: String(deptId),
              status: (emp.Status || emp.status || 'active').toLowerCase(),
              hourlyRate: emp.hourlyRate || emp['Hourly Rate'] || 0,
              color: emp.color || emp.Color || '#D4A024'
            };
          });
          setEmployees(formattedEmployees);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoadingEmployees(false);
      }
    };
    
    fetchEmployees();
  }, []);

  const departments = [
    { id: '1', name: 'Installation', employees: 8, manager: 'Mike Thompson' },
    { id: '2', name: 'Sales', employees: 4, manager: 'Lisa Chen' },
    { id: '3', name: 'Management', employees: 3, manager: 'Sarah Wilson' },
    { id: '4', name: 'Administration', employees: 2, manager: 'Steve Osborn' },
  ];

  const roles = [
    { id: '1', name: 'Admin', permissions: 'Full Access', users: 2 },
    { id: '2', name: 'Team Manager', permissions: 'Manage Team, View Reports', users: 3 },
    { id: '3', name: 'Team Member', permissions: 'View Assigned Jobs, Log Time', users: 12 },
    { id: '4', name: 'Client', permissions: 'View Projects, Approve Quotes', users: 45 },
  ];

  const taxes = [
    { id: '1', name: 'State Sales Tax', rate: 6.5, applies: 'Materials' },
    { id: '2', name: 'City Tax', rate: 2.0, applies: 'All Services' },
    { id: '3', name: 'Labor Tax Exempt', rate: 0, applies: 'Labor' },
  ];

  const roleOptions = [
    { id: 2, name: 'Technician' },
    { id: 3, name: 'Foreman' },
    { id: 4, name: 'Project Manager' },
    { id: 5, name: 'Sales Rep' },
    { id: 1, name: 'Admin' }
  ];
  const departmentOptions = [
    { id: 10, name: 'Technician' },
    { id: 8, name: 'Sales' },
    { id: 9, name: 'Admin' },
    { id: 1, name: 'Operations' }
  ];

  const handleAddEmployee = async () => {
    // Validate form
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.phone || !newEmployee.password) {
      alert('Please fill in all required fields (First Name, Last Name, Email, Phone, Password)');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call your backend API to create the employee
      const response = await fetch('http://35.92.33.215:3001/employee/create-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          firstName: newEmployee.firstName,
          lastName: newEmployee.lastName,
          email: newEmployee.email,
          phone: newEmployee.phone,
          department: Number(newEmployee.department) || 10,
          rolesPermissions: Number(newEmployee.role) || 2,
          reportingManager: 'Steve Osborn',
          password: newEmployee.password,
          status: 'active',
          portalStatus: 'active',
          hourlyRate: parseFloat(newEmployee.hourlyRate) || 0,
          color: newEmployee.color || '#D4A024'
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Find role and department names from IDs
        const selectedRole = roleOptions.find(r => r.id === Number(newEmployee.role));
        const selectedDept = departmentOptions.find(d => d.id === Number(newEmployee.department));
        
        // Add to local state
        const newEmp: Employee = {
          id: data.employee?.id || String(Date.now()),
          name: `${newEmployee.firstName} ${newEmployee.lastName}`,
          email: newEmployee.email,
          phone: newEmployee.phone,
          role: selectedRole?.name || 'Technician',
          roleId: newEmployee.role,
          department: selectedDept?.name || 'Technician',
          departmentId: newEmployee.department,
          status: 'active',
          hourlyRate: parseFloat(newEmployee.hourlyRate) || 0,
          color: newEmployee.color || '#D4A024'
        };
        setEmployees([...employees, newEmp]);

        // Reset form and close modal
        setNewEmployee({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: '',
          department: '',
          password: '',
          hourlyRate: '',
          color: '#D4A024'
        });
        setShowAddEmployeeModal(false);
        setShowPassword(false);
        alert('Employee added successfully!');
      } else {
        alert(data.message || 'Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error connecting to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (emp: Employee) => {
    const nameParts = emp.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Use stored IDs, or find by name as fallback
    const roleId = emp.roleId || roleOptions.find(r => r.name === emp.role)?.id || '';
    const deptId = emp.departmentId || departmentOptions.find(d => d.name === emp.department)?.id || '';
    
    setEditingEmployee({
      id: emp.id,
      firstName,
      lastName,
      email: emp.email,
      phone: emp.phone || '',
      role: String(roleId),
      department: String(deptId),
      status: emp.status,
      hourlyRate: String(emp.hourlyRate || ''),
      color: emp.color || '#D4A024'
    });
    setShowEditEmployeeModal(true);
  };

  const handleSaveEmployee = async () => {
    if (!editingEmployee) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`http://35.92.33.215:3001/employee/update-employee/${editingEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          firstName: editingEmployee.firstName,
          lastName: editingEmployee.lastName,
          email: editingEmployee.email,
          phone: editingEmployee.phone,
          department: Number(editingEmployee.department),
          rolesPermissions: Number(editingEmployee.role),
          status: editingEmployee.status,
          portalStatus: editingEmployee.status,
          hourlyRate: parseFloat(editingEmployee.hourlyRate) || 0,
          color: editingEmployee.color || '#D4A024'
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Find role and department names from IDs
        const selectedRole = roleOptions.find(r => r.id === Number(editingEmployee.role));
        const selectedDept = departmentOptions.find(d => d.id === Number(editingEmployee.department));
        
        // Update local state
        setEmployees(employees.map(emp => 
          emp.id === editingEmployee.id 
            ? {
                ...emp,
                name: `${editingEmployee.firstName} ${editingEmployee.lastName}`,
                email: editingEmployee.email,
                role: selectedRole?.name || emp.role,
                department: selectedDept?.name || emp.department,
                status: editingEmployee.status,
                hourlyRate: parseFloat(editingEmployee.hourlyRate) || 0,
                color: editingEmployee.color || '#D4A024'
              }
            : emp
        ));
        
        setShowEditEmployeeModal(false);
        setEditingEmployee(null);
        alert('Employee updated successfully!');
      } else {
        alert(data.message || 'Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error connecting to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: bgColor }}>
      <SidebarEnhanced activePage="Settings" darkMode={darkMode} onNavigate={onNavigate} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      <div style={{ marginLeft: '200px', flex: 1, padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', color: textColor, margin: '0 0 8px 0' }}>Settings</h1>
          <p style={{ fontSize: '14px', color: textMuted, margin: 0 }}>Manage your company settings and configurations</p>
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Sidebar Tabs */}
          <div style={{ width: '240px', backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '12px', height: 'fit-content' }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', marginBottom: '4px', backgroundColor: activeTab === tab.id ? `${accentColor}20` : 'transparent',
                  border: 'none', borderRadius: '10px', cursor: 'pointer', borderLeft: activeTab === tab.id ? `3px solid ${accentColor}` : '3px solid transparent'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon style={{ width: '18px', height: '18px', color: activeTab === tab.id ? accentColor : textMuted }} />
                    <span style={{ fontSize: '14px', fontWeight: activeTab === tab.id ? '600' : '500', color: activeTab === tab.id ? textColor : textMuted }}>{tab.label}</span>
                  </div>
                  <ChevronRight style={{ width: '16px', height: '16px', color: textMuted }} />
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, backgroundColor: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}`, padding: '24px' }}>
            {activeTab === 'employees' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', color: textColor, margin: 0 }}>Employees</h2>
                  <button 
                    onClick={() => setShowAddEmployeeModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: accentColor, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: '#FFFFFF' }}
                  >
                    <Plus style={{ width: '16px', height: '16px' }} /> Add Employee
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {loadingEmployees ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: textMuted }}>
                      Loading employees...
                    </div>
                  ) : employees.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: textMuted }}>
                      No employees found. Click "Add Employee" to add one.
                    </div>
                  ) : (
                    employees.map(emp => (
                    <div key={emp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: darkMode ? '#353535' : '#FAFAFA', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: emp.color || accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: '600', fontSize: '14px' }}>
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: textColor, margin: 0 }}>{emp.name}</p>
                          <p style={{ fontSize: '12px', color: textMuted, margin: '2px 0 0 0' }}>{emp.email}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '13px', color: textMuted }}>{emp.role}</span>
                        <span style={{ fontSize: '13px', color: textMuted }}>{emp.department}</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: accentColor }}>${emp.hourlyRate?.toFixed(2) || '0.00'}/hr</span>
                        <div style={{ padding: '4px 10px', backgroundColor: emp.status === 'active' ? '#66BB6A20' : '#9E9E9E20', borderRadius: '12px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '500', color: emp.status === 'active' ? '#66BB6A' : '#9E9E9E', textTransform: 'capitalize' }}>{emp.status}</span>
                        </div>
                        <button 
                          onClick={() => handleEditClick(emp)}
                          style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                          <Edit style={{ width: '16px', height: '16px', color: textMuted }} />
                        </button>
                      </div>
                    </div>
                  )))}
                </div>
              </>
            )}

            {activeTab === 'departments' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', color: textColor, margin: 0 }}>Departments</h2>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: accentColor, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: '#FFFFFF' }}>
                    <Plus style={{ width: '16px', height: '16px' }} /> Add Department
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {departments.map(dept => (
                    <div key={dept.id} style={{ padding: '20px', backgroundColor: darkMode ? '#353535' : '#FAFAFA', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: textColor, margin: 0 }}>{dept.name}</h3>
                        <button style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                          <Edit style={{ width: '16px', height: '16px', color: textMuted }} />
                        </button>
                      </div>
                      <p style={{ fontSize: '13px', color: textMuted, margin: '0 0 8px 0' }}>Manager: {dept.manager}</p>
                      <p style={{ fontSize: '13px', color: accentColor, margin: 0 }}>{dept.employees} employees</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'roles' && (
              <>
                <h2 style={{ fontSize: '20px', color: textColor, margin: '0 0 20px 0' }}>Roles & Permissions</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {roles.map(role => (
                    <div key={role.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: darkMode ? '#353535' : '#FAFAFA', borderRadius: '12px' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: textColor, margin: 0 }}>{role.name}</p>
                        <p style={{ fontSize: '12px', color: textMuted, margin: '4px 0 0 0' }}>{role.permissions}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '13px', color: accentColor }}>{role.users} users</span>
                        <button style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                          <Edit style={{ width: '16px', height: '16px', color: textMuted }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'taxes' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '20px', color: textColor, margin: 0 }}>Tax Rates</h2>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: accentColor, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: '#FFFFFF' }}>
                    <Plus style={{ width: '16px', height: '16px' }} /> Add Tax
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {taxes.map(tax => (
                    <div key={tax.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: darkMode ? '#353535' : '#FAFAFA', borderRadius: '12px' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: textColor, margin: 0 }}>{tax.name}</p>
                        <p style={{ fontSize: '12px', color: textMuted, margin: '4px 0 0 0' }}>Applies to: {tax.applies}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '18px', fontWeight: '700', color: accentColor }}>{tax.rate}%</span>
                        <button style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                          <Edit style={{ width: '16px', height: '16px', color: textMuted }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: cardBg,
            borderRadius: '16px',
            padding: '24px',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: textColor, margin: 0 }}>Add New Employee</h2>
              <button
                onClick={() => {
                  setShowAddEmployeeModal(false);
                  setShowPassword(false);
                }}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px'
                }}
              >
                <X style={{ width: '20px', height: '20px', color: textMuted }} />
              </button>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Name Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                    First Name <span style={{ color: '#E74C3C' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={newEmployee.firstName}
                    onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                    placeholder="John"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: darkMode ? '#353535' : '#FAFAFA',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: textColor,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                    Last Name <span style={{ color: '#E74C3C' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={newEmployee.lastName}
                    onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                    placeholder="Doe"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: darkMode ? '#353535' : '#FAFAFA',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: textColor,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                  Email <span style={{ color: '#E74C3C' }}>*</span>
                </label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  placeholder="john@blackforestfloors.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: darkMode ? '#353535' : '#FAFAFA',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: textColor,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: darkMode ? '#353535' : '#FAFAFA',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: textColor,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                  Password <span style={{ color: '#E74C3C' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      paddingRight: '45px',
                      backgroundColor: darkMode ? '#353535' : '#FAFAFA',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: textColor,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Role & Department Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                    Role
                  </label>
                  <select
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: darkMode ? '#353535' : '#FAFAFA',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: textColor,
                      outline: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Role</option>
                    {roleOptions.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                    Department
                  </label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: darkMode ? '#353535' : '#FAFAFA',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: textColor,
                      outline: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Department</option>
                    {departmentOptions.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hourly Rate & Color Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                    Hourly Rate
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: textMuted,
                      fontSize: '14px'
                    }}>$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newEmployee.hourlyRate}
                      onChange={(e) => setNewEmployee({ ...newEmployee, hourlyRate: e.target.value })}
                      placeholder="0.00"
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 28px',
                        backgroundColor: darkMode ? '#353535' : '#FAFAFA',
                        border: `1px solid ${borderColor}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: textColor,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                    Employee Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        backgroundColor: newEmployee.color,
                        border: `2px solid ${borderColor}`,
                        flexShrink: 0
                      }}
                    />
                    <input
                      type="color"
                      value={newEmployee.color}
                      onChange={(e) => setNewEmployee({ ...newEmployee, color: e.target.value })}
                      style={{
                        width: '0',
                        height: '0',
                        padding: '0',
                        border: 'none',
                        visibility: 'hidden',
                        position: 'absolute'
                      }}
                      id="addEmployeeColorPicker"
                    />
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
                      {['#D4A024', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63', '#00BCD4', '#F44336'].map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewEmployee({ ...newEmployee, color })}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: color,
                            border: newEmployee.color === color ? '2px solid #FFF' : '2px solid transparent',
                            cursor: 'pointer',
                            boxShadow: newEmployee.color === color ? '0 0 0 2px ' + color : 'none'
                          }}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => document.getElementById('addEmployeeColorPicker')?.click()}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                          border: '2px solid transparent',
                          cursor: 'pointer',
                          fontSize: '10px',
                          color: '#FFF',
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                        }}
                        title="Custom color"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => {
                  setShowAddEmployeeModal(false);
                  setShowPassword(false);
                }}
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: textColor,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddEmployee}
                disabled={isSubmitting}
                style={{
                  padding: '12px 20px',
                  backgroundColor: accentColor,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Adding...' : 'Add Employee'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditEmployeeModal && editingEmployee && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: cardBg,
            borderRadius: '16px',
            padding: '24px',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            border: `1px solid ${borderColor}`
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: textColor, margin: 0 }}>Edit Employee</h2>
              <button
                onClick={() => {
                  setShowEditEmployeeModal(false);
                  setEditingEmployee(null);
                }}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '8px'
                }}
              >
                <X style={{ width: '20px', height: '20px', color: textMuted }} />
              </button>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Name Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                    First Name <span style={{ color: '#E74C3C' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={editingEmployee.firstName}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, firstName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: darkMode ? '#353535' : '#FAFAFA',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: textColor,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                    Last Name <span style={{ color: '#E74C3C' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={editingEmployee.lastName}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, lastName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: darkMode ? '#353535' : '#FAFAFA',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: textColor,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                  Email <span style={{ color: '#E74C3C' }}>*</span>
                </label>
                <input
                  type="email"
                  value={editingEmployee.email}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: darkMode ? '#353535' : '#FAFAFA',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: textColor,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  value={editingEmployee.phone}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: darkMode ? '#353535' : '#FAFAFA',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: textColor,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Role & Department Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                    Role
                  </label>
                  <select
                    value={editingEmployee.role}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: darkMode ? '#353535' : '#FAFAFA',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: textColor,
                      outline: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Role</option>
                    {roleOptions.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                    Department
                  </label>
                  <select
                    value={editingEmployee.department}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, department: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: darkMode ? '#353535' : '#FAFAFA',
                      border: `1px solid ${borderColor}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: textColor,
                      outline: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Department</option>
                    {departmentOptions.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hourly Rate & Color Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                    Hourly Rate
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: textMuted,
                      fontSize: '14px'
                    }}>$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editingEmployee.hourlyRate}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, hourlyRate: e.target.value })}
                      placeholder="0.00"
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 28px',
                        backgroundColor: darkMode ? '#353535' : '#FAFAFA',
                        border: `1px solid ${borderColor}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: textColor,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                    Employee Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        backgroundColor: editingEmployee.color,
                        border: `2px solid ${borderColor}`,
                        flexShrink: 0
                      }}
                    />
                    <input
                      type="color"
                      value={editingEmployee.color}
                      onChange={(e) => setEditingEmployee({ ...editingEmployee, color: e.target.value })}
                      style={{
                        width: '0',
                        height: '0',
                        padding: '0',
                        border: 'none',
                        visibility: 'hidden',
                        position: 'absolute'
                      }}
                      id="editEmployeeColorPicker"
                    />
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
                      {['#D4A024', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E91E63', '#00BCD4', '#F44336'].map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setEditingEmployee({ ...editingEmployee, color })}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: color,
                            border: editingEmployee.color === color ? '2px solid #FFF' : '2px solid transparent',
                            cursor: 'pointer',
                            boxShadow: editingEmployee.color === color ? '0 0 0 2px ' + color : 'none'
                          }}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => document.getElementById('editEmployeeColorPicker')?.click()}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                          border: '2px solid transparent',
                          cursor: 'pointer',
                          fontSize: '10px',
                          color: '#FFF',
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                        }}
                        title="Custom color"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: textColor, marginBottom: '6px' }}>
                  Status
                </label>
                <select
                  value={editingEmployee.status}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: darkMode ? '#353535' : '#FAFAFA',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: textColor,
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => {
                  setShowEditEmployeeModal(false);
                  setEditingEmployee(null);
                }}
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'transparent',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: textColor,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEmployee}
                disabled={isSubmitting}
                style={{
                  padding: '12px 20px',
                  backgroundColor: accentColor,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
