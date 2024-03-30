import { useState, useEffect, useMemo } from "react";
import { Comment } from "@/types";
import CommentCard from "./CommentCard";
import CommentSkeleton from "./CommentSkeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchPostComments } from "@/services/feed";
import { fetchCommunityPostComments } from "@/services/communities";

const CommentContainer = ({
  defaultUserId,
  postId,
  communityPage,
}: {
  defaultUserId: string;
  postId: string;
  communityPage?: boolean;
}) => {
  const {
    data: comments,
    isLoading,
    isError,
  } = useQuery<Comment[]>({
    queryKey: communityPage
      ? ["community-post-comment", postId]
      : ["post-comment", postId],
    queryFn: async () =>
      communityPage
        ? await fetchCommunityPostComments(postId)
        : await fetchPostComments(postId),
    staleTime: 0,
  });
  const [showNoCommentsMessage, setShowNoCommentsMessage] = useState(false);

  useEffect(() => {
    setShowNoCommentsMessage(comments?.length === 0);
  }, [comments]);

  const sortedComments = useMemo(() => {
    return (
      comments &&
      [...comments].sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    );
  }, [comments]);

  const skeletonCards = Array.from({ length: 5 }, (_, index) => (
    <div key={index} className="w-[95%] mx-auto flex flex-col gap-8 mt-5">
      <CommentSkeleton />
    </div>
  ));

  if (isError) {
    return (
      <div>
        <p className="text-white font-bold text-[40px] text-center mt-20">
          An error occurred
        </p>
      </div>
    );
  }

  if (showNoCommentsMessage) {
    return (
      <section className="w-full flex flex-col pb-20">
        <div className="text-center py-5 text-[14px] text-gray-800 dark:text-gray-600">
          Be the first to comment
        </div>
      </section>
    );
  } else if (isLoading) {
    return (
      <section className="w-full flex flex-col pb-20">{skeletonCards}</section>
    );
  } else {
    return (
      <section className="w-full flex flex-col pb-20">
        {sortedComments?.map((comment) => (
          <CommentCard
            defaultUserId={defaultUserId}
            key={comment.commentId}
            comment={comment}
            communityPage={communityPage}
          />
        ))}
      </section>
    );
  }
};

export default CommentContainer;
