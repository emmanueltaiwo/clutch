"use client";

import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminPostOptions = () => {
  return (
    <div className="mr-5 w-fit ml-auto">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 hover:bg-[rgba(48,48,48,0.29)] rounded-full">
          <MoreVertRoundedIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Admin Tools</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="bg-red-500 focus:bg-red-600 dark:bg-red-500 dark:focus:bg-red-600">
            Delete Post
          </DropdownMenuItem>
          <DropdownMenuItem>Edit Post</DropdownMenuItem>
          <DropdownMenuItem>Change Visibility</DropdownMenuItem>
          <DropdownMenuItem>Change Who Can Reply</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AdminPostOptions;
