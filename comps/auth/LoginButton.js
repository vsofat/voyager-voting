import { useEffect, useRef } from "react";
import useGSI from "./useGSI";
import { CircularProgress } from "@material-ui/core";

export default function LoginButton() {
  const { ready, authenticating } = useGSI();
  const ref = useRef(null);

  useEffect(() => {
    if (ready && ref.current && globalThis?.google) {
      globalThis.google.accounts.id.renderButton(ref.current, {
        theme: "outline",
        size: "large",
      });
    }
  });

  if (authenticating) {
    return <CircularProgress />;
  }

  return <div ref={ref} />;
}