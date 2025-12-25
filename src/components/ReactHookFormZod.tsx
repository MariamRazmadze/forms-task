import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username is too long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

const ReactHookFormZod = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSuccessMessage("");
    setIsSuccess(false);

    try {
      const response = await fetch("https://dummyjson.com/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("🎉 API Response:", result);
        setSuccessMessage(`User created successfully! (User ID: ${result.id})`);
        setIsSuccess(true);
        reset();
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setSuccessMessage("Failed to submit. Please try again.");
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-2">React Hook Form + Zod</h1>
      <p className="text-gray-600 mb-8">
        This uses React Hook Form for performance and Zod for type-safe
        validation
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5">
          <label htmlFor="username" className="block mb-2 font-medium">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            {...register("username")}
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? "username-error" : undefined}
            className={`w-full px-3 py-2 text-base rounded-md ${
              errors.username
                ? "border-2 border-red-500"
                : "border border-gray-300"
            }`}
          />
          {errors.username && (
            <div id="username-error" className="text-red-500 text-sm mt-1" role="alert">
              {errors.username.message}
            </div>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="example@email.com"
            {...register("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`w-full px-3 py-2 text-base rounded-md ${
              errors.email
                ? "border-2 border-red-500"
                : "border border-gray-300"
            }`}
          />
          {errors.email && (
            <div id="email-error" className="text-red-500 text-sm mt-1" role="alert">
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={`w-full px-3 py-2 text-base rounded-md ${
              errors.password
                ? "border-2 border-red-500"
                : "border border-gray-300"
            }`}
          />
          {errors.password && (
            <div id="password-error" className="text-red-500 text-sm mt-1" role="alert">
              {errors.password.message}
            </div>
          )}
        </div>

        {successMessage && (
          <div
            className={`p-3 mb-5 rounded-md ${
              isSuccess
                ? "bg-green-50 border border-green-200 text-green-600"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}
            role="alert"
            aria-live="polite"
          >
            {successMessage}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 px-4 py-2.5 text-base font-medium text-white rounded-md ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit to DummyJSON API"}
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setSuccessMessage("");
              setIsSuccess(false);
            }}
            className="px-4 py-2.5 text-base font-medium text-blue-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReactHookFormZod;
