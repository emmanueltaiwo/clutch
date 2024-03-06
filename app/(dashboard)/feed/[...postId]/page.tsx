import Container from "@/components/Container";
import PostCard from "@/components/Feed/PostCard";
import { fetchPostById } from "@/services/feed";
import { getUserDocFromFirestore, handleCookies } from "@/services/auth";
import { User } from "@/types";
import PageHeader from "./components/PageHeader";
import CreateComment from "./components/CreateComment";
import CommentContainer from "./components/CommentContainer";

const PostDetails = async ({ params }: { params: { postId: string[] } }) => {
  const [username, postId] = params.postId;
  const post = await fetchPostById(postId);

  if (typeof post === "boolean") {
    return (
      <Container>
        <p className="text-white font-bold text-[40px] text-center mt-20">
          Post Does Not Exist
        </p>
      </Container>
    );
  }

  const userId = await handleCookies("get", "USER_ID");
  if (!userId || typeof userId !== "string") return;
  const user = (await getUserDocFromFirestore(userId)) as User;

  const [firstName, lastName] = post.user.fullName.split(" ");

  return (
    <Container>
      <PageHeader postId={postId} postUserId={post.userId} userId={userId} />

      <div className="border-b-[0.5px] flex flex-col gap-3 pb-5">
        <PostCard
          postId={postId}
          username={username}
          firstName={firstName}
          lastName={lastName}
          profilePic={post.user.profilePic}
          fullName={post.user.fullName}
          createdAtString={post.createdAtString}
          updatedAtString={post.updatedAtString}
          updatedAt={post.updatedAt}
          createdAt={post.createdAt}
          post={post.post}
          postDetailPage={true}
          totalLikes={post.totalLikes}
          hasLikePost={post.hasLikePost}
          defaultUserId={userId}
        />

        <hr className="w-[95%] border-[0.2px] mx-auto" />

        <CreateComment user={user} postId={postId} />

        <hr className="w-[95%] border-[0.2px] mx-auto" />
      </div>

      <CommentContainer postId={postId} defaultUserId={userId} />
    </Container>
  );
};

export default PostDetails;
