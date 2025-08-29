'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Settings, 
  Bell, 
  Search, 
  PlusCircle,
  Edit2,
  Trash2,
  Check,
  X,
  LogOut,
  Menu,
  X as CloseIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

function generateCode(name) {
  const prefix = name.substring(0, 3).toUpperCase();
  const randomNum = Math.floor(100 + Math.random() * 900);
  returcn `${prefix}${randomNum}`;
}

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [employees, setEmployees] = useState([]);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    } else {
      const initial = [
        { id: 1, name: 'Sarah Johnson', role: 'Barista', code: 'SAR123', avatar: '/avatars/sarah.jpg' },
        { id: 2, name: 'Michael Chen', role: 'Cafe Manager', code: 'MIC456', avatar: '/avatars/michael.jpg' },
        { id: 3, name: 'Emma Rodriguez', role: 'Cashier', code: 'EMM789', avatar: '/avatars/emma.jpg' },
      ];
      setEmployees(initial);
      localStorage.setItem('employees', JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const addEmployee = () => {
    if (!newName || !newRole) return;
    const newEmployee = {
      id: Date.now(),
      name: newName,
      role: newRole,
      code: generateCode(newName),
      avatar: '/avatars/default.jpg'
    };
    setEmployees([...employees, newEmployee]);
    setNewName('');
    setNewRole('');
    setShowForm(false);
  };

  const saveEdit = (id) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, name: editName, role: editRole } : emp
    ));
    setEditingId(null);
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('employees');
    router.push('/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-white dark:bg-gray-800 shadow-md"
          >
            {isMobileMenuOpen ? <CloseIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      )}

      {/* Sidebar - Hidden on mobile unless menu is open */}
      <div className={`
        ${isMobile ? 'fixed inset-0 z-40 transform transition-transform duration-300' : 'relative'} 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 py-6 px-4 flex flex-col justify-between
      `}>
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="TipTop Logo"
                width={100}
                height={60}
                priority
              />
            </div>
            {!isMobile && (
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-gray-500" />
              </Button>
            )}
          </div>

          <nav className="space-y-1">
            {[
              { key: 'overview', label: 'Dashboard', icon: BarChart3 },
              { key: 'employees', label: 'Employees', icon: Users },
              { key: 'transactions', label: 'Transactions', icon: CreditCard },
              { key: 'settings', label: 'Settings', icon: Settings },
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === key
                    ? 'bg-[var(--accent)] hover:opacity-90'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => handleTabChange(key)}
              >
                <Icon className="mr-3 h-5 w-5" />
                {label}
              </Button>
            ))}
          </nav>
        </div>
        
        {isMobile && (
          <Button 
            variant="destructive" 
            className="flex items-center justify-center h-10 bg-red-600 mt-4"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" /> Logout
          </Button>
        )}
      </div>

      {/* Overlay for mobile menu */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

<div className={`flex-1 ${isMobile ? 'overflow-auto' : 'overflow-hidden'} md:overflow-auto`}>
        <header className="flex items-center justify-between p-4 md:p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatars/default.jpg" />
                <AvatarFallback>EC</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white">Cafe Admin</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">EthioCoffee</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search employees..."
                className="pl-10 w-64 bg-gray-100 dark:bg-gray-700 border-none"
              />
            </div>
            
            {/* Mobile search button */}
            {isMobile && (
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5 text-gray-500" />
              </Button>
            )}
            
            {!isMobile && (
              <Button 
                variant="destructive" 
                className="flex items-center justify-center h-10 bg-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" /> Logout
              </Button>
            )}
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsContent value="overview">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Welcome back, Cafe Admin!</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Here's a summary of your cafe operations.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-sm md:text-base">Total Employees</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{employees.length}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-sm md:text-base">Unique Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                        {[...new Set(employees.map(e => e.role))].length}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-sm md:text-base">Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">24</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm md:text-base">Recent Employees</CardTitle>
                    <CardDescription>Recently added team members</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence>
                      {employees.slice(-3).map(emp => (
                        <motion.div
                          key={emp.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={emp.avatar || '/avatars/default.jpg'} />
                              <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-white">{emp.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{emp.role}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-black text-white text-xs">{emp.code}</Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="employees">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                  <div>
                    <CardTitle className="text-sm md:text-base text-gray-800 dark:text-white">Employees</CardTitle>
                    <CardDescription>Manage your cafe staff</CardDescription>
                  </div>

                  {!showForm ? (
                    <Button onClick={() => setShowForm(true)} className="bg-[var(--accent)] flex items-center w-full md:w-auto">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
                    </Button>
                  ) : (
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                      <Input placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} />
                      <Input placeholder="Role" value={newRole} onChange={e => setNewRole(e.target.value)} />
                      <Button onClick={addEmployee} className="bg-[var(--accent)] hover:opacity-80">Save</Button>
                      <Button variant="outline" onClick={() => {setNewName(''); setNewRole(''); setShowForm(false)}}>Cancel</Button>
                    </div>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    <AnimatePresence>
                      {employees.map(emp => (
                        <motion.div
                          key={emp.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 space-y-2 md:space-y-0"
                        >
                          <div className="flex items-center space-x-4 w-full md:w-auto">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={emp.avatar || '/avatars/default.jpg'} />
                              <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                            </Avatar>

                            {editingId === emp.id ? (
                              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                                <Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Name" />
                                <Input value={editRole} onChange={e => setEditRole(e.target.value)} placeholder="Role" />
                              </div>
                            ) : (
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800 dark:text-white">{emp.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{emp.role}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between w-full md:w-auto space-x-2 self-end md:self-auto">
                            <Badge variant="outline" className="bg-black text-white text-xs">{emp.code}</Badge>
                            {editingId === emp.id ? (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => saveEdit(emp.id)}><Check className="h-4 w-4 text-green-500" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}><X className="h-4 w-4 text-red-500" /></Button>
                              </>
                            ) : (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => {setEditingId(emp.id); setEditName(emp.name); setEditRole(emp.role)}}><Edit2 className="h-4 w-4 text-gray-500" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => deleteEmployee(emp.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                              </>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-sm md:text-base">Transactions</CardTitle>
                  <CardDescription>Manage cafe transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">No transactions yet.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-sm md:text-base">Profile & Account</CardTitle>
                    <CardDescription>Update cafe information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="/avatars/default.jpg" />
                        <AvatarFallback>EC</AvatarFallback>
                      </Avatar>
                      <Input type="file" accept="image/*" className="w-full" />
                    </div>
                    <Input placeholder="Cafe Name" className="w-full" />
                    <Input placeholder="Cafe Email" type="email" className="w-full" />
                    <Input placeholder="New Password" type="password" className="w-full" />
                    <Button className="bg-[var(--accent)] hover:opacity-80 w-full md:w-auto">Save Profile</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}