"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/api";
import { Toaster, toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Copy,
  CheckCircle,
  LogOut,
  Loader2,
  DollarSign,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function EmployeeDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [bankInfo, setBankInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    if (role !== "employee") {
      router.push("/auth/login");
      return;
    }
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const profileRes = await apiService.getEmployeeProfile();
      setProfile(profileRes.data || profileRes);

      const txRes = await apiService.request("/employees/transactions");
      const txArray = Array.isArray(txRes.data) ? txRes.data : [];
      setTransactions(txArray);

      const bankRes = await apiService.getBankAccount();
      setBankInfo(bankRes.data || bankRes || null);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.removeToken();
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_info");
    router.push("/auth/login");
  };

  const copyTipCode = () => {
    if (profile?.tip_code) {
      navigator.clipboard.writeText(profile.tip_code);
      setCopied(true);
      toast.success("Tip code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const monthlyTotal = transactions
    .filter((t) => {
      const d = new Date(t.created_at);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading...
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md text-center">
          <XCircle className="mx-auto h-6 w-6 text-red-600" />
          <CardDescription>
            Failed to load profile. Please log in again.
          </CardDescription>
          <Button onClick={handleLogout} className="mt-4 bg-red-600 text-white">
            Go to Login
          </Button>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Employee Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>
              Welcome, {profile.first_name} {profile.last_name}
            </span>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center text-red-600 border-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="bank">Bank</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6 mt-4">
            <Card>
              <CardHeader className="flex justify-between">
                <CardTitle>Total Tips</CardTitle>
                <DollarSign className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{transactions.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex justify-between">
                <CardTitle>This Month</CardTitle>
                <TrendingUp className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{monthlyTotal} ETB</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex justify-between">
                <CardTitle>Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <Badge variant={profile.is_active ? "default" : "secondary"}>
                  {profile.is_active ? "Active" : "Inactive"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tip Code</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-2">
                <Input value={profile.tip_code || "Not available"} readOnly />
                <Button onClick={copyTipCode} variant="outline" size="sm">
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions" className="space-y-4 mt-4">
            {transactions.length > 0 ? (
              transactions.map((t, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>Tip #{i + 1}</CardTitle>
                    <CardDescription>
                      {new Date(t.created_at).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-between">
                    <span className="font-bold text-green-600">
                      +{t.amount} ETB
                    </span>
                    <Badge variant="outline">{t.status}</Badge>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center py-8 text-gray-500">
                No transactions yet
              </p>
            )}
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Info</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>First Name:</strong> {profile.first_name}</p>
                <p><strong>Last Name:</strong> {profile.last_name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Tip Code:</strong> {profile.tip_code}</p>
                <p><strong>Status:</strong>
                  <Badge variant={profile.is_active ? "default" : "secondary"} className="ml-2">
                    {profile.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant={profile.is_verified ? "default" : "destructive"} className="ml-2">
                    {profile.is_verified ? "Verified" : "Unverified"}
                  </Badge>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

        

          {/* Bank */}
          <TabsContent value="bank" className="space-y-4 mt-4">
            {bankInfo ? (
              <Card>
                <CardHeader>
                  <CardTitle>Bank Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Sub Account ID:</strong> {bankInfo.sub_account_id}
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(bankInfo.updated_at).toLocaleString()}
                  </p>
                  <Badge variant="default">Ready to receive payments</Badge>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No bank info found.</p>
                <Button
                  onClick={() => router.push("/dashboard/employee/bank-setup")}
                  className="bg-[#71FF71]"
                >
                  Set Up Bank Account
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}
