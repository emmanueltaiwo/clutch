import Container from "@/components/Container";
import RightPanel from "@/components/RightPanel";
import ProfileFeed from "@/components/profile-details/ProfileFeed";
import ProfileHeader from "@/components/profile-details/ProfileHeader";
import ProfileTab from "@/components/profile-details/ProfileTab";
import { getUserDocFromFirestore, handleCookies } from "@/services/auth";
import {
  fetchUserFollowers,
  hasUserAlreadyFollowed,
  verifyUserProfileExists,
} from "@/services/profile";

const ProfilePage = async ({ params }: { params: { profile: string } }) => {
  const profileExist = await verifyUserProfileExists(params.profile);

  const defaultUserId = await handleCookies("get", "USER_ID");
  if (typeof defaultUserId === "boolean") return;

  if (!profileExist.exists) {
    return <Container>User does not exist</Container>;
  }

  const user = await getUserDocFromFirestore(profileExist.userId);
  if (typeof user === "boolean") return;

  const { country, email, fullName, gender, profilePic, username, bio } = user;
  const isUserAlreadyFollowing = await hasUserAlreadyFollowed(
    profileExist.userId
  );
  const totalFollowers = await fetchUserFollowers(profileExist.userId);

  return (
    <main>
      <div className="flex justify-between">
        <Container>
          <ProfileHeader
            country={country}
            email={email}
            fullName={fullName}
            gender={gender}
            profilePic={profilePic}
            username={username}
            userId={profileExist.userId}
            defaultUserId={defaultUserId}
            bio={bio}
            isUserAlreadyFollowing={isUserAlreadyFollowing}
            totalFollowers={totalFollowers}
          />
          <div
            className={`mt-3 md:mt-0 md:relative ${
              profileExist.userId === defaultUserId
                ? "md:top-[-100px]"
                : "md:top-[-60px]"
            }`}
          >
            <hr />
            <ProfileTab userId={profileExist.userId} />
            <ProfileFeed userId={profileExist.userId} />
          </div>
        </Container>
        <RightPanel />
      </div>
    </main>
  );
};

export default ProfilePage;
