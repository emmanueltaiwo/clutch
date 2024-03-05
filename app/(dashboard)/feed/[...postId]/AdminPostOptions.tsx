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
import { useAppDispatch } from "@/lib/hooks";
import { editPost } from "@/lib/features/editPost/editPostSlice";
import { deletePost } from "@/services/feed";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

const AdminPostOptions = ({ postId }: { postId: string }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();

  return (
    <div className="mr-5 w-fit ml-auto">
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 hover:bg-[rgba(48,48,48,0.29)] rounded-full">
            <MoreVertRoundedIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Admin Tools</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="bg-red-500 focus:bg-red-600 dark:bg-red-500 dark:focus:bg-red-600">
                Delete Post
              </DropdownMenuItem>
            </AlertDialogTrigger>

            <DropdownMenuItem onClick={() => dispatch(editPost())}>
              Edit Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const response = await deletePost(postId);
                if (!response) {
                  return toast({
                    title: "An Error Occured!",
                    description: "Refresh page and try again",
                  });
                }

                router.back();
                return toast({
                  title: "Post Deleted Succesfully",
                  description: "Your Post Has Been Deleted! Enjoy Clutch!",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPostOptions;
