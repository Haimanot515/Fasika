import React, { useState, useEffect, useCallback } from 'react';
// 🟢 Changed import to use your centralized axios instance
import api from '../../api/axios'; 
import { 
  HiOutlineUserGroup, HiOutlineTrash, HiOutlineSearch,
  HiOutlineLockClosed, HiOutlineLockOpen, HiOutlineChevronLeft, 
  HiOutlineChevronRight, HiOutlineUsers, HiOutlineBan,
  HiOutlineAdjustments, HiOutlineRefresh
} from 'react-icons/hi';
import { RiRadioButtonLine, RiShieldUserLine } from 'react-icons/ri';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  
  const [metrics, setMetrics] = useState({
    total: 0, farmers: 0, buyers: 0, suspended: 0, deleted: 0
  });

  const limit = 10;
  // 🟢 Removed local 'const api = axios.create...' as we now use the import

  const theme = {
    primaryGreen: '#065f46',
    lightGreen: '#10b981',
    bgGreen: '#f0fdf4',
    accentGold: '#fbbf24',
    textMain: '#064e3b',
    border: '#d1fae5',
    danger: '#ef4444',
    warning: '#f59e0b'
  };

  const fetchMetrics = useCallback(async () => {
    try {
      // Points to: base_url + /admin/users/stats
      const res = await api.get('/admin/users/stats');
      if (res.data.success) setMetrics(res.data);
    } catch (err) { console.error("Stats Error", err); }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      // Points to: base_url + /admin/users/?limit...
      const response = await api.get(`/admin/users/?limit=${limit}&offset=${page * limit}`);
      setUsers(response.data.users || []);
    } catch (err) { console.error("Fetch Error", err); } 
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { 
    fetchUsers(); 
    fetchMetrics(); 
  }, [fetchUsers, fetchMetrics]);

  const handleStatusToggle = async (id, currentStatus) => {
    const action = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const confirmMsg = action === 'SUSPENDED' 
      ? "Suspend this user? They will be locked out of the marketplace." 
      : "Reactivate this user account?";
    
    if (window.confirm(confirmMsg)) {
      try {
        const res = await api.patch(`/admin/users/${id}/status`, { action });
        if (res.data.success) {
          setUsers(prev => prev.map(u => u.id === id ? { ...u, account_status: action } : u));
          fetchMetrics();
        }
      } catch (err) { alert('Status update failed'); }
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
      fetchMetrics();
    } catch (err) { alert('Unauthorized'); }
  };

  const handleDrop = async (id) => {
    if (window.confirm('CRITICAL: Execute DROP sequence for this identity? This cannot be undone.')) {
      try {
        // 🟢 Using DROP logic via DELETE request
        await api.delete(`/admin/users/${id}`);
        setUsers(prev => prev.filter(user => user.id !== id));
        fetchMetrics();
      } catch (err) { alert('DROP Failed'); }
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const advancedBtn = {
    display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px',
    borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer',
    transition: 'all 0.2s', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  };

  return (
    <div style={{ backgroundColor: theme.bgGreen, minHeight: '100vh', paddingBottom: '50px', fontFamily: "'Inter', sans-serif" }}>
      
      {/* 🟢 HEADER & METRICS */}
      <div style={{ background: theme.primaryGreen, padding: '15px 30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
          <RiShieldUserLine size={28} color={theme.accentGold} />
          <span style={{ fontWeight: '900', fontSize: '20px' }}>FASIKAS ADMIN</span>
        </div>
        <div style={{ flex: 1, display: 'flex', background: '#fff', borderRadius: '6px', overflow: 'hidden' }}>
          <input style={{ flex: 1, border: 'none', padding: '12px 20px', outline: 'none' }} placeholder="Search Identity..." onChange={(e) => setSearchTerm(e.target.value)} />
          <button style={{ background: theme.accentGold, border: 'none', padding: '0 20px' }}><HiOutlineSearch size={20}/></button>
        </div>
      </div>

      <div style={{ background: '#047857', padding: '12px 30px', display: 'flex', gap: '40px' }}>
        <div style={{ color: '#fff' }}><HiOutlineUserGroup color={theme.accentGold}/> Farmers: <strong>{metrics.farmers}</strong></div>
        <div style={{ color: '#fff' }}><HiOutlineUsers color={theme.accentGold}/> Buyers: <strong>{metrics.buyers}</strong></div>
        <div style={{ color: '#fff' }}><HiOutlineBan color="#fca5a5"/> Suspended: <strong>{metrics.suspended}</strong></div>
        <div style={{ color: '#fff', marginLeft: 'auto' }}><HiOutlineTrash/> System Drops: <strong>{metrics.deleted}</strong></div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '30px auto', background: '#fff', borderRadius: '12px', border: `1px solid ${theme.border}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '20px 30px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between' }}>
           <h2 style={{ margin: 0, color: theme.primaryGreen, fontSize: '18px' }}>Active User Registry</h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '15px 30px', textAlign: 'left', fontSize: '11px', color: '#6b7280' }}>IDENTITY</th>
                <th style={{ padding: '15px 30px', textAlign: 'left', fontSize: '11px', color: '#6b7280' }}>ROLE</th>
                <th style={{ padding: '15px 30px', textAlign: 'left', fontSize: '11px', color: '#6b7280' }}>STATUS</th>
                <th style={{ padding: '15px 30px', textAlign: 'center', fontSize: '11px', color: '#6b7280' }}>ADVANCED MANAGEMENT</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ padding: '50px', textAlign: 'center' }}><RiRadioButtonLine className="animate-spin" size={30} color={theme.lightGreen} /></td></tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} onMouseEnter={() => setHoveredRow(user.id)} onMouseLeave={() => setHoveredRow(null)} style={{ backgroundColor: hoveredRow === user.id ? theme.bgGreen : 'transparent', borderBottom: `1px solid ${theme.border}` }}>
                    <td style={{ padding: '16px 30px' }}>
                      <div style={{ fontWeight: '700', color: theme.textMain }}>{user.full_name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{user.email}</div>
                    </td>
                    <td style={{ padding: '16px 30px' }}>
                        <select 
                          value={user.role} 
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          style={{ padding: '6px', borderRadius: '4px', border: `1px solid ${theme.border}`, fontWeight: '600' }}
                        >
                          <option value="BUYER">BUYER</option>
                          <option value="FARMER">FARMER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                    </td>
                    <td style={{ padding: '16px 30px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: '900', background: user.account_status === 'ACTIVE' ? '#dcfce7' : '#fee2e2', color: user.account_status === 'ACTIVE' ? '#166534' : '#991b1b' }}>
                        {user.account_status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 30px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        
                        {/* 🔒 SUSPEND / ACTIVATE BUTTON */}
                        <button 
                          onClick={() => handleStatusToggle(user.id, user.account_status)}
                          style={{ ...advancedBtn, background: user.account_status === 'ACTIVE' ? theme.warning : theme.lightGreen, color: '#fff' }}
                        >
                          {user.account_status === 'ACTIVE' ? <HiOutlineLockClosed size={14}/> : <HiOutlineLockOpen size={14}/>}
                          {user.account_status === 'ACTIVE' ? 'SUSPEND' : 'ACTIVATE'}
                        </button>
                        
                        {/* 🗑️ DROP BUTTON */}
                        <button 
                          onClick={() => handleDrop(user.id)}
                          style={{ ...advancedBtn, background: theme.danger, color: '#fff' }}
                        >
                          <HiOutlineTrash size={14} /> DROP
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
