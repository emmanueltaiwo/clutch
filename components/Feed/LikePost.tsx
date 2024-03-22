import { FC, useState } from "react";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { handleLikePost } from "@/services/feed";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  postId: string;
  totalLikes: number;
  hasLikePost: boolean;
};

const LikePost: FC<Props> = ({ postId, totalLikes, hasLikePost }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [favouritedPost, setFavouritedPost] = useState<boolean>(hasLikePost);
  const { mutate: mutateLikePost, isPending } = useMutation({
    mutationFn: (e: {
      preventDefault: () => void;
      stopPropagation: () => void;
    }) => {
      e.preventDefault();
      e.stopPropagation();

      return favouritePost(e);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
    },
  });

  const favouritePost = async (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setFavouritedPost(hasLikePost ? false : true);
      const response = await handleLikePost(postId);

      if (response !== "Post Favourited Successfully") {
        return toast({
          title: response,
          description: response,
        });
      }

      return toast({
        title: response,
        description: "Yay! This post has been added to your favourites",
      });
    } catch (error) {
      throw new Error();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault(); // Prevents the default link behavior
    mutateLikePost(e);
  };

  return (
    <button
      disabled={isPending}
      onClick={handleClick}
      className={`transition-all duration-300 px-[8px] py-[13px] rounded-full hover:text-red-500 flex items-center gap-1 hover:bg-[rgba(248,79,79,0.1)] ${
        !favouritedPost && "text-gray-600"
      } ${isPending && "cursor-progress"} `}
    >
      {favouritedPost ? (
        <FavoriteRoundedIcon className="text-red-500" fontSize="small" />
      ) : (
        <FavoriteBorderRoundedIcon fontSize="small" />
      )}

      <span className="text-[13px] font-[300] text-gray-500">{totalLikes}</span>
    </button>
  );
};

export default LikePost;
