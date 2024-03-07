"use client";

import { useState, useEffect, useMemo } from "react";
import { Comment, User } from "@/types";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { getUserDocFromFirestore } from "@/services/auth";
import { formatDate } from "@/utils/helpers";
import CommentCard from "./CommentCard";
import CommentSkeleton from "./CommentSkeleton";

const CommentContainer = ({
  defaultUserId,
  postId,
}: {
  defaultUserId: string;
  postId: string;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showNoCommentsMessage, setShowNoCommentsMessage] = useState(false);

  useEffect(() => {
    const fetchAllComments = async () => {
      try {
        const q = query(collection(db, "comments"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const promises = querySnapshot.docs
            .filter((doc) => doc.data().postId === postId)
            .map(async (doc) => {
              const comment = doc.data() as Comment;
              const user = (await getUserDocFromFirestore(
                comment.userId
              )) as User;

              return {
                commentId: comment.commentId,
                userId: comment.userId,
                postId: comment.postId,
                commentText: comment.commentText,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                createdAtString: formatDate(comment.createdAt),
                updatedAtString: formatDate(comment.updatedAt),
                user: {
                  fullName: user.fullName,
                  profilePic: user.profilePic,
                  country: user.country,
                },
              };
            });

          Promise.all(promises).then((newComments) => {
            setComments(newComments);
            
              setShowNoCommentsMessage(newComments.length === 0);
            
          });
        });

        return () => unsubscribe();
      } catch (error) {
        throw new Error();
      }
    };

    fetchAllComments();
  }, [postId]);

  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
  }, [comments]);

  const skeletonCards = Array.from({ length: 5 }, (_, index) => (
    <div key={index} className="w-[95%] mx-auto h-full flex flex-col gap-3">
      <CommentSkeleton />
    </div>
  ));

  return (
    <section className="w-full flex flex-col pb-20">
      {showNoCommentsMessage ? (
        <div className="text-center py-5 text-[14px] text-gray-800 dark:text-gray-600">
          Be the first to comment
        </div>
      ) : sortedComments.length < 1 ? (
        skeletonCards
      ) : (
        sortedComments.map((comment) => (
          <CommentCard
            defaultUserId={defaultUserId}
            key={comment.commentId}
            comment={comment}
          />
        ))
      )}
    </section>
  );
};

export default CommentContainer;
