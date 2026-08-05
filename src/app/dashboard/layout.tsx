"use client";

import type { ReactNode } from "react";
import { DashboardLayout } from "../../../components/dashboardComponents/DashboardContent.jsx";

export default function DashboardLayoutPage({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
