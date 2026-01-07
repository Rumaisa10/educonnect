"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
export default function Test() {
  const handleClick = (mode) => {
    mode ? toast.success("test success") : toast.error("test error");
  };
  return <Button onClick={() => handleClick(false)}>test toast</Button>;
}
