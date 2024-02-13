"use client";

import React, { FC, useEffect, useState } from "react";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import {
  fetchAllLikesForPost,
  findAllLikedPost,
  handleLikePost,
} from "@/services/feed";
import { useToast } from "@/components/ui/use-toast";

type Props = {
  postId: string;
};

const LikePost: FC<Props> = ({ postId }) => {
  const { toast } = useToast();
  const [favouritedPost, setFavouritedPost] = useState<boolean>(false);
  const [totalLikes, setTotalLikes] = useState<number>(0);

  useEffect(() => {
    const fetchLikedPost = async () => {
      try {
        const likedPosts = await findAllLikedPost();
        likedPosts.forEach((post) => {
          if (post.postId === postId) {
            setFavouritedPost(true);
          }
        });
      } catch (error) {
        throw new Error();
      }
    };

    fetchLikedPost();
  }, [postId]);

  useEffect(() => {
    const fetchPostLikeCount = async () => {
      try {
        const likeCount = await fetchAllLikesForPost(postId);
        setTotalLikes(likeCount.length);
      } catch (error) {
        throw new Error();
      }
    };

    fetchPostLikeCount();
  }, [postId]);

  const favouritePost = async (e: { preventDefault: () => void; stopPropagation: () => void; }) => {
    e.preventDefault();
    e.stopPropagation();
    try {
     
      setFavouritedPost(true);
      const response = await handleLikePost(postId);

      if (response !== "Post Favourited Successfully") {
        setFavouritedPost(false);
        setTotalLikes((prevLikes) => prevLikes - 1);
        return toast({
          title: response,
          description: response,
        });
      }

      setFavouritedPost(true);
      setTotalLikes((prevLikes) => prevLikes + 1);
      return toast({
        title: response,
        description: "Yay! This post has been added to your favourites",
      });
    } catch (error) {
      throw new Error();
    }
  };

  return (
    <button
      onClick={favouritePost}
      className={`transition-all duration-300 px-[8px] py-[13px] rounded-full hover:text-red-500 flex items-center gap-1 hover:bg-[rgba(248,79,79,0.1)] ${
        !favouritedPost && "text-gray-600"
      } `}
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
