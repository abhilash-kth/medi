"use client";

import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { AddMedicineDialog } from "./add-medicine-dialog";
import { fetchSearchRequests } from "./searchRequestData";

interface Request {
  id: number;
  canonicalName: string;
  brand: string;
  strength: string;
  form: string;
  variant: string;
  operatorName: string; // ✅ added
}

export function SearchRequestTable() {
  const [data, setData] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const res = await fetchSearchRequests();
    setData(res.data);
    setLoading(false);
  };

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading requests...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Requests</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Query</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Strength</TableHead>
              <TableHead>Form</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No pending requests
                </TableCell>
              </TableRow>
            )}

            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.canonicalName}</TableCell>

                <TableCell>{row.brand}</TableCell>

                <TableCell>{row.strength}</TableCell>

                <TableCell>{row.form}</TableCell>

                <TableCell className="uppercase">
                  <Badge variant="secondary">{row.variant}</Badge>
                </TableCell>

                {/* ✅ Operator name */}
                <TableCell>{row.operatorName || "—"}</TableCell>

                <TableCell className="text-right">
                  <AddMedicineDialog request={row} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
