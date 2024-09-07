"use client";

import { expressionColors, isExpressionColor } from "./_utils/expression-colors";
import { motion } from "framer-motion";
import { CSSProperties } from "react";
import * as R from "remeda";
import { Progress } from "../ui/progress";

export default function Expressions({
  values,
}: {
  values: Record<string, number>;
}) {
  const top3: Array<[string, number]> = ['interest', 'determination', 'excitement', 'satisfaction', 'realization', 'confusion', 'tiredness', 'fear'].map(k => [k, values[k] || 0]);

  return (
    <div
      className={
        "text-xs p-3 w-full border-t border-border flex flex-col gap-3"
      }
    >
      {top3.map(([key, value]) => (
        <div className={"w-full overflow-hidden"}>
          <div className={"flex items-start justify-between gap-1 font-mono pb-1"}>
            <div className={"font-medium truncate"}>{key}</div>
            <div className={"tabular-nums opacity-50"}>{value.toFixed(2)}</div>
          </div>
          <div
            className={"relative h-1"}
            style={
              {
                "--bg": isExpressionColor(key)
                  ? expressionColors[key]
                  : "var(--bg)",
              } as CSSProperties
            }
          >
            <div
              className={
                "absolute top-0 left-0 size-full rounded-full opacity-10 bg-[var(--bg)]"
              }
            />
            <motion.div
              className={
                "absolute top-0 left-0 h-full bg-[var(--bg)] rounded-full"
              }
              initial={{ width: 0 }}
              animate={{
                width: `${R.pipe(
                  value,
                  R.clamp({ min: 0, max: 1 }),
                  (value) => `${value * 100}%`
                )}`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
