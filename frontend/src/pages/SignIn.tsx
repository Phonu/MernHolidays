import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

import * as apiClient from "../api-clients";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type SignInFormData = {
  email: string;
  password: string;
};
const SignIn = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  // using react-query to fetch sign In API.
  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      console.log("user has been signed In");
      // 1. show the toast
      // 2. navigate to the home page
      showToast({ message: "Login successful", type: "SUCCESS" });
      await queryClient.invalidateQueries("valdiateToken");
      navigate("/");
    },
    onError: async (error: Error) => {
      console.log("error while sign IN", error);
      // show the toast
      showToast({ message: `Login failed ${error.message} `, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data: SignInFormData) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Sign In</h2>
      <label className="text-gray-700 text-sm font-bold">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This field is required" })}
        ></input>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold">
        Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 character",
            },
          })}
        ></input>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          LOGIN
        </button>
      </span>
    </form>
  );
};
export default SignIn;
