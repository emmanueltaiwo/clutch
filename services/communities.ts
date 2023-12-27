"use server";

const generateCommunityID = async (
  communityName: string
): Promise<string | boolean> => {
  if (!communityName) {
    return false;
  }

  try {
    let hash = 0;
    const date = new Date().toString();

    for (let i = 0; i < communityName.length; i++) {
      const char = communityName.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    const generatedID = hash + date;

    return generatedID;
  } catch (error) {
    return false;
  }
};
