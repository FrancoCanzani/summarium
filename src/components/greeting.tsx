"use client";

import { getGreeting } from "@/lib/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";

export const Greeting = () => {
  const greeting = getGreeting();

  const today = new Date();

  return (

  );
};
