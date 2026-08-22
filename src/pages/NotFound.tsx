import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-5 bg-common-white px-5 py-10">
      <img
        src="/not-found.webp"
        alt="not found pic"
        width={600}
        height={450}
        className="h-auto w-full max-w-[650px] object-contain"
      />

      <Typography variant="body1">
        صفحه مورد نظر یافت نشد
      </Typography>

      <Button
        component={Link}
        to="/"
        variant="contained"
      >
        بازگشت به خانه
      </Button>
    </div>
  );
}