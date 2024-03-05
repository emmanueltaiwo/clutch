import { FC, ReactNode } from "react";
import Link from "next/link";

const LinkWrapper: FC<{
  children: ReactNode;
  username: string;
  postId: string;
  postDetailPage?: boolean;
}> = ({ children, username, postId, postDetailPage }) => {
  return (
    <Link
      href={`/feed/${username}/${postId}`}
      key={postId}
      className="w-full border-t-[1px] border-gray-800 dark:border-gray-700 px-5 pt-5 pb-1 flex flex-col gap-5 hover:bg-[rgba(48,48,48,0.24)] transition-all duration-300 border-b-[0.5px]"
    >
      {children}
    </Link>
  );
};

const CardWrapper: FC<{
  children: ReactNode;
  postId: string;
  postDetailPage?: boolean;
}> = ({ children, postId, postDetailPage }) => {
  return (
    <div
      key={postId}
      className="w-full border-t-[1px] border-gray-800 dark:border-gray-700 px-5 pt-5 pb-1 flex flex-col gap-5 hover:bg-[rgba(48,48,48,0.24)] transition-all duration-300"
    >
      {children}
    </div>
  );
};

type WrapperComponentProps = {
  children: ReactNode;
  username: string;
  postId: string;
  postDetailPage?: boolean;
};

const WrapperComponent: FC<WrapperComponentProps> = ({
  children,
  postId,
  username,
  postDetailPage,
}) => {
  const Wrapper = postDetailPage ? CardWrapper : LinkWrapper;
  return (
    <Wrapper
      username={username}
      postId={postId}
      postDetailPage={postDetailPage}
    >
      {children}
    </Wrapper>
  );
};

export default WrapperComponent;
