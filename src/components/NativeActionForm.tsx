import { useActionState, useRef } from "react";

type FormState = {
  success?: boolean;
  message?: string;
  userId?: number;
  errors?: {
    username?: string;
    email?: string;
    password?: string;
  };
};

async function submitForm(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const errors: FormState["errors"] = {};

  if (!username || username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }
  if (!email || !email.includes("@")) {
    errors.email = "Please enter a valid email";
  }
  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    const response = await fetch("https://dummyjson.com/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("🎉 API Response:", data);
      return {
        success: true,
        message: "User created successfully!",
        userId: data.id,
      };
    } else {
      throw new Error("API request failed");
    }
  } catch (error) {
    console.error("❌ Error:", error);
    return {
      success: false,
      message: "Failed to submit. Please try again.",
    };
  }
}

const NativeActionForm = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    submitForm,
    {}
  );

  const handleReset = () => {
    formRef.current?.reset();
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-2">Native Form with Action Prop</h1>
      <p className="text-gray-600 mb-8">
        This uses React 19's action prop with native HTML form elements
      </p>

      <form action={formAction} ref={formRef}>
        <div className="mb-5">
          <label htmlFor="username" className="block mb-2 font-medium">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            className={`w-full px-3 py-2 text-base rounded-md ${
              state.errors?.username
                ? "border-2 border-red-500"
                : "border border-gray-300"
            }`}
          />
          {state.errors?.username && (
            <div className="text-red-500 text-sm mt-1">
              {state.errors.username}
            </div>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="example@email.com"
            className={`w-full px-3 py-2 text-base rounded-md ${
              state.errors?.email
                ? "border-2 border-red-500"
                : "border border-gray-300"
            }`}
          />
          {state.errors?.email && (
            <div className="text-red-500 text-sm mt-1">
              {state.errors.email}
            </div>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            className={`w-full px-3 py-2 text-base rounded-md ${
              state.errors?.password
                ? "border-2 border-red-500"
                : "border border-gray-300"
            }`}
          />
          {state.errors?.password && (
            <div className="text-red-500 text-sm mt-1">
              {state.errors.password}
            </div>
          )}
        </div>

        {state.message && (
          <div
            className={`p-3 mb-5 rounded-md ${
              state.success
                ? "bg-green-50 border border-green-200 text-green-600"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}
          >
            {state.message}
            {state.userId && ` (User ID: ${state.userId})`}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className={`flex-1 px-4 py-2.5 text-base font-medium text-white rounded-md ${
              isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            }`}
          >
            {isPending ? "Submitting..." : "Submit to DummyJSON API"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 text-base font-medium text-blue-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default NativeActionForm;
