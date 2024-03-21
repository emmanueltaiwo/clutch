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
import { editComment } from "@/lib/features/editComment/editCommentSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AdminPostOptions = ({
  postId,
  userId,
  type,
}: {
  postId: string;
  userId: string;
  type: string;
}) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const { mutate: mutateDelete, isPending } = useMutation({
    mutationFn: () => handleDelete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comment", postId] });
    },
  });

  const handleDelete = async () => {
    const response = await deletePost(postId, type);
    if (!response) {
      return toast({
        title: "An Error Occured!",
        description: "Refresh page and try again",
      });
    }

    if (type === "post") router.back();

    return toast({
      title: `${type === "post" ? "Post" : "Comment"} Deleted Succesfully`,
      description: `Your ${
        type === "post" ? "post" : "comment"
      } Has Been Deleted! Enjoy Clutch!`,
    });
  };

  return (
    <div className="ml-auto w-fit">
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
                Delete {type === "post" ? "post" : "comment"}
              </DropdownMenuItem>
            </AlertDialogTrigger>

            <DropdownMenuItem
              onClick={() => {
                if (type === "post") {
                  return dispatch(editPost({ postId: postId, userId: userId }));
                } else if (type === "comment") {
                  return dispatch(
                    editComment({ commentId: postId, userId: userId })
                  );
                }
              }}
            >
              Edit {type === "post" ? "post" : "comment"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              {type === "post" ? "post" : "comment"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (type === "post") {
                  return handleDelete();
                } else {
                  return mutateDelete();
                }
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
