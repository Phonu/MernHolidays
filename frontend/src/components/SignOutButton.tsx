import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-clients";
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = () => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      // this come from AppContent(useQuery)
      await queryClient.invalidateQueries("valdiateToken");
      //show toast
      showToast({ message: "Signed Out !!", type: "SUCCESS" });
    },
    onError: (error: Error) => {
      //show
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const handleSignOut = () => mutation.mutate();
  return (
    <button
      className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100"
      type="submit"
      onClick={handleSignOut}
    >
      {"Sign Out"}
    </button>
  );
};

export default SignOutButton;
