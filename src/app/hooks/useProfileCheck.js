// // hooks/useProfileCheck.js
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";

// export const useProfileCheck = () => {
//   const { userData, loading } = useSelector((state) => state.profile);

//   const checkProfileCompletion = (requiredRole = null) => {
//     if (!userData) {
//       toast.error("Please login to access this feature");
//       return false;
//     }

//     if (requiredRole && userData.role !== requiredRole) {
//       toast.error(`This feature is only available for ${requiredRole}s`);
//       return false;
//     }

//     const minCompletion = userData.role === "seller" ? 92 : 100;

//     if (
//       !userData.has_complete_profile &&
//       userData.profile_completion?.total < minCompletion
//     ) {
//       const completionPercentage = userData.profile_completion?.total || 0;
//       return false;
//     }

//     return true;
//   };

//   return {
//     userData,
//     loading,
//     checkProfileCompletion,
//     isSeller: userData?.role === "seller",
//     isBuyer: userData?.role === "buyer",
//     hasCompleteProfile: userData?.has_complete_profile || false,
//     profileCompletion: userData?.profile_completion?.total || 0,
//   };
// };


// hooks/useProfileCheck.js
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export const useProfileCheck = () => {
  const { userData, loading } = useSelector((state) => state.profile);

  const activeProfile =
    userData?.activeProfile || userData?.active_profile;

  const checkProfileCompletion = (requiredProfile = null) => {
    if (!userData) {
      toast.error("Please login to access this feature");
      return false;
    }

    // Check active mode instead of role
    if (requiredProfile && activeProfile !== requiredProfile) {
      toast.error(
        `This feature is only available in ${requiredProfile} mode`
      );
      return false;
    }

    const minCompletion = activeProfile === "seller" ? 92 : 100;

    if (
      !userData.has_complete_profile &&
      userData.profile_completion?.total < minCompletion
    ) {
      toast.error(
        `Complete at least ${minCompletion}% of your profile to continue`
      );
      return false;
    }

    return true;
  };

  return {
    userData,
    loading,
    checkProfileCompletion,

    // Use activeProfile instead of role
    isSeller: activeProfile === "seller",
    isBuyer: activeProfile === "buyer",

    hasCompleteProfile: userData?.has_complete_profile || false,
    profileCompletion: userData?.profile_completion?.total || 0,

    activeProfile, // expose for convenience
  };
};