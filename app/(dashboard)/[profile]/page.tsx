import Container from "@/components/Container";
import RightPanel from "@/components/RightPanel";
import ProfileFeed from "@/components/profile-details/ProfileFeed";
import ProfileHeader from "@/components/profile-details/ProfileHeader";
import ProfileTab from "@/components/profile-details/ProfileTab";
import { getUserDocFromFirestore, handleCookies } from "@/services/auth";
import { verifyUserProfileExists } from "@/services/profile";

const ProfilePage = async ({ params }: { params: { profile: string } }) => {
  const profileExist = await verifyUserProfileExists(params.profile);
  const defaultUserId = await handleCookies("get", "USER_ID");
  if (typeof defaultUserId === "boolean") return;

  if (!profileExist.exists) {
    return <Container>User does not exist</Container>;
  }

  const user = await getUserDocFromFirestore(profileExist.userId);
  if (typeof user === "boolean") return;

  const { country, email, fullName, gender, profilePic, username } = user;

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
          />
          <hr />
          <ProfileTab userId={profileExist.userId} />
          <ProfileFeed userId={profileExist.userId} />
        </Container>
        <RightPanel />
      </div>
    </main>
  );
};

export default ProfilePage;
