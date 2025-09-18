"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function TransactionsPage() {
  const [tips, setTips] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTip, setSelectedTip] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setError("No admin token found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        const tipsRes = await axios.get(
          `${API_BASE_URL}/admin/reports/tips?per_page=1000`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        let tipsData = tipsRes.data;
        if (typeof tipsData === "string") {
          tipsData = JSON.parse(tipsData.substring(tipsData.indexOf("{")));
        }
        setTips(tipsData.data || []);

        const paymentsRes = await axios.get(
          `${API_BASE_URL}/admin/reports/payments?per_page=1000`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        let paymentsData = paymentsRes.data;
        if (typeof paymentsData === "string") {
          paymentsData = JSON.parse(paymentsData.substring(paymentsData.indexOf("{")));
        }
        setPayments(paymentsData.data || []);
      } catch (err) {
        console.error(err.response || err);
        setError("Failed to fetch transactions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p className="text-center py-10">Loading transactions...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <div className="space-y-8">

      <Card className="rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Tips</CardTitle>
        </CardHeader>
        <CardContent>
          {tips.length === 0 ? (
            <p className="text-muted-foreground">No tips found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tip ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tips.map((tip) => (
                  <TableRow
                    key={tip.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedTip(tip)}
                  >
                    <TableCell>{tip.id}</TableCell>
                    <TableCell className="text-secondary font-semibold">{tip.amount} ETB</TableCell>
                    <TableCell>{tip.status}</TableCell>
                    <TableCell>{tip.created_at ? new Date(tip.created_at).toLocaleString() : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-muted-foreground">No payments found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Chapa Fee</TableHead>
                  <TableHead>Service Fee</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    <TableCell>{payment.id}</TableCell>
                    <TableCell className="text-secondary font-semibold">{payment.amount} ETB</TableCell>
                    <TableCell>{payment.chapa_fee} ETB</TableCell>
                    <TableCell>{payment.service_fee} ETB</TableCell>
                    <TableCell>{payment.created_at ? new Date(payment.created_at).toLocaleString() : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedTip} onOpenChange={() => setSelectedTip(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tip Details</DialogTitle>
          </DialogHeader>
          {selectedTip && (
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {selectedTip.id}</p>
              <p><strong>Employee ID:</strong> {selectedTip.employee_id}</p>
              <p><strong>Service Provider ID:</strong> {selectedTip.service_provider_id}</p>
              <p><strong>Amount:</strong> {selectedTip.amount} ETB</p>
              <p><strong>Status:</strong> {selectedTip.status}</p>
              <p><strong>Created At:</strong> {selectedTip.created_at ? new Date(selectedTip.created_at).toLocaleString() : "-"}</p>
              <p><strong>Updated At:</strong> {selectedTip.updated_at ? new Date(selectedTip.updated_at).toLocaleString() : "-"}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {selectedPayment.id}</p>
              <p><strong>Employee ID:</strong> {selectedPayment.employee_id}</p>
              <p><strong>Tip ID:</strong> {selectedPayment.tip_id}</p>
              <p><strong>Amount:</strong> {selectedPayment.amount} ETB</p>
              <p><strong>Chapa Fee:</strong> {selectedPayment.chapa_fee} ETB</p>
              <p><strong>Service Fee:</strong> {selectedPayment.service_fee} ETB</p>
              <p><strong>Created At:</strong> {selectedPayment.created_at ? new Date(selectedPayment.created_at).toLocaleString() : "-"}</p>
              <p><strong>Updated At:</strong> {selectedPayment.updated_at ? new Date(selectedPayment.updated_at).toLocaleString() : "-"}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
