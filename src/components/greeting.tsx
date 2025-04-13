"use client";

import { getGreeting } from "@/lib/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";

export const Greeting = () => {
  const greeting = getGreeting();

  const today = new Date();

  return (
    <div key="overview" className="">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-semibold"
      >
        {greeting}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="text-muted-foreground text-2xl"
      >
        <p className="text-muted-foreground">
          Here&apos;s a quick overview for today,{" "}
          {format(today, "MMMM d, yyyy")}.
        </p>{" "}
      </motion.div>
    </div>
  );
};
