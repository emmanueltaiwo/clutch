"use client";

import { useRouter } from "next/navigation";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="p-2 hover:bg-[rgba(48,48,48,0.29)] rounded-full"
    >
      <ArrowBackIcon className="dark:text-white" />
    </button>
  );
};

export default BackButton;
